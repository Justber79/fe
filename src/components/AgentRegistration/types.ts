import { AgentServiceType, AgentType } from "need4deed-sdk";

// These types are not yet in need4deed-sdk — defined locally until the SDK is updated.
export enum AgentMembershipStatus {
  PENDING = "pending",
  ACTIVE = "active",
}

export interface ApiAgentRegisterNew {
  title: string;
  type?: AgentType;
  info?: string;
  website?: string;
  services?: AgentServiceType[];
  addressStreet?: string;
  addressPostcode?: string;
  districtId?: number;
  languages?: number[];
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
