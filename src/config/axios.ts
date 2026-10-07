import axios from "axios";
import i18next from "i18next";
import { Lang } from "need4deed-sdk";
import { markSessionExpired, rememberSessionExpired } from "@/utils/apiErrors";
import { clearAuthHint } from "@/utils/helpers";
import {
  apiPathAuthRefresh,
  apiPathLogin,
  apiPathPasswordReset,
  apiPathRequestPasswordReset,
  supportedLangs,
} from "./constants";

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

const getActiveLanguage = (): Lang => {
  if (typeof window !== "undefined") {
    const routeLanguage = window.location.pathname.split("/")[1];
    if (supportedLangs.includes(routeLanguage)) return routeLanguage as Lang;
  }

  const i18nLanguage = (i18next.resolvedLanguage ?? i18next.language)?.split("-")[0];
  return supportedLangs.includes(i18nLanguage) ? (i18nLanguage as Lang) : Lang.EN;
};

axios.interceptors.request.use((config) => {
  if (!config.url?.startsWith("/api/")) return config;

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

    if (
      error.response?.status !== 401 ||
      !originalRequest.url ||
      noRefreshPaths.some((path) => originalRequest.url.includes(path)) ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

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
      const response = await axios.post(apiPathAuthRefresh);
      const { access } = response.data;

      originalRequest.headers.Authorization = `Bearer ${access}`;

      processQueue(null, access);

      return axios(originalRequest);
    } catch (refreshError: unknown) {
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
        if (typeof refreshError === "object" && refreshError) markSessionExpired(refreshError);
        window.location.href = "/login";
      }
      processQueue(refreshError, null);

      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axios;
