import axios from "axios";
import i18next from "i18next";
import { Lang } from "need4deed-sdk";
import { toast } from "react-toastify";
import { markSessionExpired } from "@/utils/apiErrors";
import { clearAuthHint } from "@/utils/helpers";
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

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown | null, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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

    // If already refreshing, add to queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // Attempt to refresh token
      const response = await axios.post(apiPathAuthRefresh);
      const { access } = response.data;

      // Update Authorization header for original request
      originalRequest.headers.Authorization = `Bearer ${access}`;

      // Process queue with new token
      processQueue(null, access);

      return axios(originalRequest);
    } catch (refreshError: unknown) {
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
        // Queued and retried requests fail the same way; one toast covers them all.
        toast.error("Session expired. Please log in again.", { toastId: "session-expired" });
        markSessionExpired(error);
        if (typeof refreshError === "object" && refreshError) markSessionExpired(refreshError);
        window.location.href = "/login";
      }
      processQueue(refreshError, null);

      // Surface the original 401, not the refresh failure.
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axios;
