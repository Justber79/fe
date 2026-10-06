import axios from "axios";
import i18next from "i18next";
import { Lang } from "need4deed-sdk";
import { markSessionExpired, rememberSessionExpired } from "@/utils/apiErrors";
import { clearAuthHint, setAuthHint } from "@/utils/helpers";
import {
  apiPathAuthRefresh,
  apiPathLogin,
  apiPathPasswordReset,
  apiPathRequestPasswordReset,
  supportedLangs,
} from "./constants";

// Public auth endpoints: a 401 from these means bad credentials or an invalid
// reset token, not an expired session, so there's nothing to refresh. Retrying
// them via refresh would also replace the real error (e.g. "Bad credentials.")
// with the refresh endpoint's "Refresh token is required.".
const noRefreshPaths = [apiPathAuthRefresh, apiPathLogin, apiPathRequestPasswordReset, apiPathPasswordReset];

// A refresh answered with one of these means the session is gone; anything else
// (429, 5xx, network) is a hiccup and must not log the user out.
const SESSION_REJECTED_STATUSES = [400, 401, 403, 404];
// A 401 this soon after a refresh was sent with the old cookie: retry, don't refresh again.
const RECENT_REFRESH_MS = 3000;

let refreshPromise: Promise<string> | null = null;
let lastRefresh = { at: 0, access: "" };

// One refresh for all concurrent 401s.
const refreshSession = (): Promise<string> => {
  if (Date.now() - lastRefresh.at < RECENT_REFRESH_MS) return Promise.resolve(lastRefresh.access);
  if (!refreshPromise) {
    refreshPromise = axios
      .post(apiPathAuthRefresh)
      .then((response) => {
        setAuthHint();
        lastRefresh = { at: Date.now(), access: response.data.access };
        return lastRefresh.access;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

let isLoggingOut = false;

// From here on no refresh may run (it could set the auth cookies again after
// logout); waits for one already in flight. Reset if the logout itself fails.
export const startLogout = async (): Promise<void> => {
  isLoggingOut = true;
  await refreshPromise?.catch(() => undefined);
};
export const cancelLogout = (): void => {
  isLoggingOut = false;
};

const isSessionRejected = (refreshError: unknown) =>
  axios.isAxiosError(refreshError) && SESSION_REJECTED_STATUSES.includes(refreshError.response?.status ?? 0);

// Don't set baseURL - let Next.js proxy handle the routing
// axios.defaults.baseURL = apiURL;

const getActiveLanguage = (): Lang => {
  if (typeof window !== "undefined") {
    // This is the same [lang] route segment that useParams() adds to
    // language-sensitive query keys, keeping request params and caches aligned.
    const routeLanguage = window.location.pathname.split("/")[1];
    if (supportedLangs.includes(routeLanguage)) return routeLanguage as Lang;
  }

  const i18nLanguage = (i18next.resolvedLanguage ?? i18next.language)?.split("-")[0];
  return supportedLangs.includes(i18nLanguage) ? (i18nLanguage as Lang) : Lang.EN;
};

axios.interceptors.request.use((config) => {
  // Only decorate requests to our Next.js API proxy. External services and
  // presigned upload URLs must receive exactly the query string they expect.
  if (!config.url?.startsWith("/api/")) return config;

  // Language is intentional on both reads and mutations: translated content
  // must be loaded and saved in the same active language. Auth routes safely
  // ignore this undeclared query parameter on the backend.
  const language = getActiveLanguage();

  if (config.params instanceof URLSearchParams) {
    if (!config.params.has("language")) config.params.set("language", language);
    return config;
  }

  const params = config.params as Record<string, unknown> | undefined;
  config.params = { ...params, language: params?.language ?? language };
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry on 401 (unauthorized), not 403 (forbidden - permission issue)
    // Also skip public auth endpoints (incl. refresh itself) or if already retried
    if (
      error.response?.status !== 401 ||
      !originalRequest.url ||
      noRefreshPaths.some((path) => originalRequest.url.includes(path)) ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    if (isLoggingOut) {
      return Promise.reject(markSessionExpired(error));
    }

    let access: string;
    try {
      access = await refreshSession();
    } catch (refreshError: unknown) {
      if (!isSessionRejected(refreshError)) return Promise.reject(refreshError);

      clearAuthHint();

      // Only redirect if we aren't already on a public auth-flow/form entry page
      // (login, a standalone form, or the public event page) —
      // those pages shouldn't be hijacked by a stale/expired session.
      const isRedirecting = !(
        window.location.pathname.includes("login") ||
        window.location.pathname.includes("forms") ||
        window.location.pathname.includes("register") ||
        window.location.pathname.includes("event-page")
      );
      if (isRedirecting) {
        // Every request waiting on this refresh lands here; the login page's
        // "session expired" toast covers them all.
        rememberSessionExpired();
        markSessionExpired(error);
        window.location.href = "/login";
      }

      // Surface the original 401, not the refresh failure.
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${access}`;
    return axios(originalRequest);
  },
);

export default axios;
