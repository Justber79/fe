import axios from "axios";
import { toast } from "react-toastify";
import { clearAuthHint } from "@/utils/helpers";
import { apiPathAuthRefresh } from "./constants";

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

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry on 401 (unauthorized), not 403 (forbidden - permission issue)
    // Also skip if it's a refresh request itself or if already retried
    if (
      error.response?.status !== 401 ||
      originalRequest.url.includes(apiPathAuthRefresh) ||
      originalRequest._retry ||
      !originalRequest.url
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
      // If refresh fails, process queue with error and redirect to login
      processQueue(refreshError, null);

      clearAuthHint();

      // Only redirect if we aren't already on a public auth-flow/form entry page
      // (login, or a standalone form like forms/volunteer or register/agent) —
      // those pages shouldn't be hijacked by a stale/expired session.
      if (
        !(
          window.location.pathname.includes("login") ||
          window.location.pathname.includes("forms") ||
          window.location.pathname.includes("register")
        )
      ) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axios;
