import axios, { InternalAxiosRequestConfig } from "axios";
import i18next from "i18next";
import { Lang } from "need4deed-sdk";
import { toast } from "react-toastify";
import { getLocalizedErrorMessage, markSessionExpired, rememberSessionExpired } from "@/utils/apiErrors";
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

// Anything else (429, 5xx, network) is a hiccup and must not log the user out.
const SESSION_REJECTED_STATUSES = [400, 401, 403, 404];
const REFRESH_COOLDOWN_MS = 10_000;

type TrackedRequest = InternalAxiosRequestConfig & { sentAt?: number; _retry?: boolean };

let refreshPromise: Promise<string | undefined> | null = null;
let lastRefresh: { at: number; access?: string } = { at: 0 };
let lastHiccup: { at: number; error?: unknown } = { at: 0 };

const refreshSession = (): Promise<string | undefined> => {
  if (Date.now() - lastHiccup.at < REFRESH_COOLDOWN_MS) return Promise.reject(lastHiccup.error);
  if (!refreshPromise) {
    refreshPromise = axios
      .post(apiPathAuthRefresh)
      .then((response) => {
        const access = typeof response.data?.access === "string" ? response.data.access : undefined;
        setAuthHint();
        lastRefresh = { at: Date.now(), access };
        return access;
      })
      .catch((refreshError: unknown) => {
        if (!isSessionRejected(refreshError)) lastHiccup = { at: Date.now(), error: refreshError };
        throw refreshError;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

let isLoggingOut = false;

// A refresh landing after logout would set the auth cookies again.
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
  (config as TrackedRequest).sentAt = Date.now();

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
    const originalRequest = error.config as TrackedRequest;

    // Only retry on 401 (unauthorized), not 403 (forbidden - permission issue)
    // Also skip public auth endpoints (incl. refresh itself) or if already retried
    if (
      error.response?.status !== 401 ||
      !originalRequest.url ||
      noRefreshPaths.some((path) => originalRequest.url?.includes(path)) ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    if (isLoggingOut) {
      return Promise.reject(markSessionExpired(error));
    }

    let access: string | undefined;
    if ((originalRequest.sentAt ?? 0) < lastRefresh.at) {
      // Sent with the old cookie before the last refresh finished: just retry.
      access = lastRefresh.access;
    } else {
      try {
        access = await refreshSession();
      } catch (refreshError: unknown) {
        if (isLoggingOut) return Promise.reject(markSessionExpired(error));

        if (!isSessionRejected(refreshError)) {
          toast.error(getLocalizedErrorMessage(refreshError, i18next.t), { toastId: "session-refresh-failed" });
          return Promise.reject(markSessionExpired(error));
        }

        clearAuthHint();

        const isRedirecting = !(
          window.location.pathname.includes("login") ||
          window.location.pathname.includes("forms") ||
          window.location.pathname.includes("register") ||
          window.location.pathname.includes("event-page")
        );
        if (isRedirecting) {
          rememberSessionExpired();
          markSessionExpired(error);
          window.location.href = "/login";
        }

        return Promise.reject(error);
      }
    }

    if (access) originalRequest.headers.Authorization = `Bearer ${access}`;
    return axios(originalRequest);
  },
);

export default axios;
