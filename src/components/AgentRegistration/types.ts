import { AgentServiceType, AgentType } from "need4deed-sdk";

export interface AgentRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export const defaultAgentRegistrationData: AgentRegistrationData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
};

export const TOTAL_STEPS = 1;
export const TOTAL_COMPLETION_STEPS = 3;

export interface ProfileCompletionData {
  addressStreet: string;
  addressPostcode: string;
  districtId: number | null;
  organizationName: string;
  organizationType: AgentType | "";
  about: string;
  website: string;
  services: AgentServiceType[];
  clientLanguageIds: number[];
}

export const defaultProfileCompletionData: ProfileCompletionData = {
  addressStreet: "",
  addressPostcode: "",
  districtId: null,
  organizationName: "",
  organizationType: "",
  about: "",
  website: "",
  services: [],
  clientLanguageIds: [],
};
