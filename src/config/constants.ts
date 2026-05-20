import { Lang } from "need4deed-sdk";
export { AgentRoleType as AgentRoles } from "need4deed-sdk";
export const tokenKey = "token";
export const urlApi = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const apiPrefix = "api";
export const apiPathVolunteer = `/${apiPrefix}/volunteer`;
export const apiPathComment = `/${apiPrefix}/comment`;
export const apiPathCommunication = `/${apiPrefix}/communication`;
export const apiPathAppreciation = `/${apiPrefix}/appreciation`;
export const apiPathLogin = `/${apiPrefix}/auth/login`;
export const apiPathAuthRefresh = `/${apiPrefix}/auth/refresh`;
export const apiPathAuthEmailDomain = `/${apiPrefix}/auth-email-domain/`;
export const apiPathOpportunity = `/${apiPrefix}/opportunity`;
export const apiPathAgent = `/${apiPrefix}/agent`;
export const apiPathOption = `/${apiPrefix}/option`;
export const apiPathOpportunityVolunteer = `/${apiPrefix}/opportunity-volunteer`;
export const apiPathMe = `/${apiPrefix}/user/me`;
export const apiPathPerson = `/${apiPrefix}/person/`;
export const apiPathOrganization = `/${apiPrefix}/organization/`;
export const cloudfrontDataURL = process.env.NEXT_PUBLIC_CLOUDFRONT_DATA_URL;
export const cacheTTL = 1000 * 60 * 5; // 5 minutes
export const TABLE_LIMIT = 20;

export enum ScreenTypes {
  MOBILE = "mobile",
  TABLET = "tablet",
  DESKTOP = "desktop",
}

export const screenSizeThresholds = {
  tablet: 768,
  desktop: 1440,
};

export const eightDays = 1000 * 60 * 60 * 24 * 8;
export const twoDays = 1000 * 60 * 60 * 24 * 2;

export const phoneRegEx = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

export const n4dLanguageLocalStorageKey = "n4d-language";

export const eventsSectionContainerId = "events-section-container";

export const cloudfrontURL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

export const minPLZGermany = 1067;
export const maxPLZGermany = 99998;

export const minPLZBerlin = 10115;
export const maxPLZBerlin = 14199;

export const defaultAvatarURL = "head-silhouette.webp";
export const defaultAvatarVolunteerProfile = "all_genders_avatar.png";

export enum DashboardRoutes {
  Home = "/dashboard",
  Volunteers = "/dashboard/volunteers",
  Opportunities = "/dashboard/opportunities",
  Agents = "/dashboard/agents",
  Racs = "/dashboard/racs",
  Posts = "/dashboard/posts",
  Calendar = "/dashboard/calendar",
  Profile = "/dashboard/profile",
}

export const questionMark = "?";

export const supportedLangs = Object.values(Lang) as string[];

export const EMPTY_PLACEHOLDER_VALUE = "–";

export const MAX_DESCRIPTION_LENGTH = 500;

export const PHONE_NUMBER_REGEX = /^\+[0-9\s]+$/;

export const LOGGED_IN_COOKIE = "is_logged_in=true; path=/; max-age=6000; SameSite=Lax; Secure";
