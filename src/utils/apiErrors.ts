import axios from "axios";
import { TFunction } from "i18next";

type ApiErrorBody = { error?: string; message?: string };

const ERROR_CLASS_KEYS: Record<string, string> = {
  AlreadyUsedTokenError: "message.apiErrors.alreadyUsedToken",
  PersonAlreadyRegisteredError: "message.apiErrors.personAlreadyRegistered",
  InvalidOrganizationEmailError: "agentRegistration.errors.invalidOrganizationEmail",
};

const STATUS_KEYS: Record<number, string> = {
  401: "message.apiErrors.unauthenticated",
  403: "message.apiErrors.unauthorized",
  404: "message.apiErrors.notFound",
  429: "message.apiErrors.tooManyRequests",
};

// Backend `message` is English diagnostic text, so errors are matched by class
// name (`error`) or status. Other 4xx errors still show `message` until mapped.
export function getLocalizedErrorMessage(error: unknown, t: TFunction): string {
  if (!axios.isAxiosError(error)) return t("message.errorGeneric");

  const status = error.response?.status;
  const data = error.response?.data as ApiErrorBody | string | undefined;
  const body = typeof data === "object" && data !== null ? data : undefined;

  const key = (body?.error && ERROR_CLASS_KEYS[body.error]) || (status && STATUS_KEYS[status]);
  if (key) return t(key);
  if (body?.message?.startsWith("Validation failed")) return t("message.validationFailed");
  if (!status || status >= 500) return t("message.errorGeneric");

  const message = body?.message ?? (typeof data === "string" ? data : undefined);
  return message || t("message.errorGeneric");
}
