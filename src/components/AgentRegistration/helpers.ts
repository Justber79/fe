import { AgentType } from "need4deed-sdk";
import { AgentRegistrationData } from "./types";

export const AGENT_TYPE_LABELS: Record<AgentType, string> = {
  [AgentType.AE]: "AE",
  [AgentType.GU1]: "GU1",
  [AgentType.GU2]: "GU2",
  [AgentType.GU2_PLUS]: "GU2+",
  [AgentType.GU3]: "GU3",
  [AgentType.NU]: "NU",
  [AgentType.ASOG]: "ASOG",
  [AgentType.COUNSELING_CENTER]: "Counseling Center",
  [AgentType.TANDEM]: "Tandem",
  [AgentType.MULTIPLE_SOCIAL_SUPPORT]: "Multiple Social Support",
};

export function validateStep(
  step: number,
  data: AgentRegistrationData,
  t: (k: string) => string,
): Partial<Record<keyof AgentRegistrationData, string>> {
  const errors: Partial<Record<keyof AgentRegistrationData, string>> = {};
  const required = t("form.error.required");

  if (step === 1) {
    if (!data.firstName.trim()) errors.firstName = required;
    if (!data.lastName.trim()) errors.lastName = required;
    if (!data.email.trim()) errors.email = required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = t("form.error.email");
    if (!data.password) errors.password = required;
    else if (data.password.length < 8) errors.password = t("agentRegistration.errors.passwordTooShort");
    if (!data.confirmPassword) errors.confirmPassword = required;
    else if (data.password !== data.confirmPassword)
      errors.confirmPassword = t("agentRegistration.errors.passwordMismatch");
  }

  if (step === 2) {
    if (!data.organizationName.trim()) errors.organizationName = required;
    if (!data.organizationType) errors.organizationType = required;
  }

  if (step === 3) {
    if (!data.addressStreet.trim()) errors.addressStreet = required;
    if (!data.addressPostcode.trim()) errors.addressPostcode = required;
  }

  return errors;
}
