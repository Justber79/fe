import { ApiAgentRegisterNew } from "need4deed-sdk";

export type { ApiAgentRegisterNew };

// AgentMembershipStatus/ApiAgentRegisterResponse/ApiAgentMembership* are not
// yet in need4deed-sdk (or differ slightly in optionality) — defined locally
// until the SDK is updated. ApiAgentRegisterNew above IS in the SDK now
// (typeId/serviceIds, not the old type/services enum fields).
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

export const TOTAL_STEPS = 1;
export const TOTAL_COMPLETION_STEPS = 3;

export interface ProfileCompletionData {
  addressStreet: string;
  addressPostcode: string;
  districtId: number | null;
  organizationName: string;
  // AgentType option id, picked from GET /option's agent_type list — like
  // clientLanguageIds below, ids rather than a translated title, since this
  // step already has the full {id,title} option objects to pick from.
  organizationType: number | "";
  about: string;
  website: string;
  services: number[];
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
