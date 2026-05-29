import { AgentServiceType, AgentType } from "need4deed-sdk";

export interface AgentRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationName: string;
  organizationType: AgentType | "";
  about: string;
  website: string;
  addressStreet: string;
  addressPostcode: string;
  districtId: number | null;
  services: AgentServiceType[];
  clientLanguageIds: number[];
}

export const defaultAgentRegistrationData: AgentRegistrationData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  organizationName: "",
  organizationType: "",
  about: "",
  website: "",
  addressStreet: "",
  addressPostcode: "",
  districtId: null,
  services: [],
  clientLanguageIds: [],
};

export const TOTAL_STEPS = 5;
