import { AgentRegistrationData, ProfileCompletionData } from "./types";

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
    if (!data.phone.trim()) errors.phone = required;
    else if (data.phone.trim().length < 7) errors.phone = t("agentRegistration.errors.phoneTooShort");
    if (!data.consent) errors.consent = required;
  }

  return errors;
}

export function validateCompletionStep(
  step: number,
  data: ProfileCompletionData,
  t: (k: string) => string,
): Partial<Record<keyof ProfileCompletionData, string>> {
  const errors: Partial<Record<keyof ProfileCompletionData, string>> = {};
  const required = t("form.error.required");

  if (step === 1) {
    if (!data.addressStreet.trim()) errors.addressStreet = required;
    if (!data.addressPostcode.trim()) errors.addressPostcode = required;
  }

  if (step === 2) {
    if (!data.organizationName.trim()) errors.organizationName = required;
    if (!data.organizationType) errors.organizationType = required;
  }

  return errors;
}
