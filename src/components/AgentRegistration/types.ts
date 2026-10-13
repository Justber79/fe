import { ApiAgentRegisterNew } from "need4deed-sdk";

export type { ApiAgentRegisterNew };

export enum AgentMembershipStatus {
  PENDING = "pending",
  ACTIVE = "active",
}

export type ApiAgentRegister = { agent: ApiAgentRegisterNew } | { agentId: number };

export interface ApiAgentRegisterResponse {
  membershipStatus: AgentMembershipStatus;
}

export interface AgentRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  consent: boolean;
}

export const defaultAgentRegistrationData: AgentRegistrationData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  consent: false,
};

export type AccountRegistrationData = AgentRegistrationData;
export const defaultAccountRegistrationData = defaultAgentRegistrationData;

export const TOTAL_STEPS = 1;
export const TOTAL_COMPLETION_STEPS = 3;

export interface ProfileCompletionData {
  addressStreet: string;
  addressPostcode: string;
  organizationName: string;
  organizationType: number | "";
  about: string;
  website: string;
  services: number[];
  clientLanguageIds: number[];
}

export const defaultProfileCompletionData: ProfileCompletionData = {
  addressStreet: "",
  addressPostcode: "",
  organizationName: "",
  organizationType: "",
  about: "",
  website: "",
  services: [],
  clientLanguageIds: [],
};

export interface ApiAgentMembershipPerson {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ApiAgentMembership {
  id: number;
  status: AgentMembershipStatus;
  agentTitle?: string;
  person?: ApiAgentMembershipPerson;
}
