import axios from "axios";
import { TFunction } from "i18next";

type ApiErrorBody = { error?: string; message?: string };

// Only classes whose meaning is the same wherever they're thrown. Generic ones
// (BadRequestError, NotFoundError, UnauthorizedError, ...) carry route-specific
// messages, so those still show the backend `message` until they get their own class.
const ERROR_CLASS_KEYS: Record<string, string> = {
  AlreadyUsedTokenError: "message.apiErrors.alreadyUsedToken",
  PersonAlreadyRegisteredError: "message.apiErrors.personAlreadyRegistered",
  InvalidOrganizationEmailError: "agentRegistration.errors.invalidOrganizationEmail",
};

const SESSION_EXPIRED = Symbol("sessionExpired");

let isLeavingPage = false;
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    isLeavingPage = true;
  });
}

// The session-expired redirect already tells the user why these failed.
export function markSessionExpired<T extends object>(error: T): T {
  (error as Record<symbol, boolean>)[SESSION_EXPIRED] = true;
  return error;
}

// No toast for these: the session-expired toast covers them, or the request was
// cut off because the page is navigating away (logout, login redirect).
export function isSilentError(error: unknown): boolean {
  if (axios.isCancel(error)) return true;
  if (typeof error === "object" && error !== null && SESSION_EXPIRED in error) return true;
  return isLeavingPage && axios.isAxiosError(error) && !error.response;
}

const COMMUNICATION_DELETE_DENIED = /^You do not have permission to delete communication with id:(\d+)\.$/;

export function getLocalizedErrorMessage(error: unknown, t: TFunction): string {
  if (!axios.isAxiosError(error)) return t("message.errorGeneric");

  const status = error.response?.status;
  const data = error.response?.data as ApiErrorBody | string | undefined;
  const body = typeof data === "object" && data !== null ? data : undefined;
  const message = body?.message ?? (typeof data === "string" ? data : undefined);

  const key = body?.error ? ERROR_CLASS_KEYS[body.error] : undefined;
  if (key) return t(key);
  if (status === 429) return t("message.apiErrors.tooManyRequests");
  if (!status || status >= 500) return t("message.errorGeneric");
  if (message?.startsWith("Validation failed")) return t("message.validationFailed");

  // That 403 has no error class yet, so it's still matched by its text.
  const communicationDenied = message?.match(COMMUNICATION_DELETE_DENIED);
  if (communicationDenied) {
    return t("dashboard.communicationSection.deletePermissionError", { id: communicationDenied[1] });
  }

  return message || t("message.errorGeneric");
}
