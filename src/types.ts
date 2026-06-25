export interface PropsWithToken {
  token?: string | null;
}

export type MenuItemType = [string, string];

export type RouteParams<T extends string = string> = {
  params: Promise<{ id: T }>;
};

export type VolunteerIdProps = {
  volunteerId: string;
};

// Please, when adding a new line, ensure it's placed in a sorted way. !!!
export enum Subpage {
  ABOUT = "about",
  DATA_PRIVACY = "data-privacy",
  FAQ = "faq",
  LEGAL_NOTICE = "legal-notice",
  LOGIN = "login",
  OPPORTUNITY_CARDS = "opportunity-cards",
  VOLUNTEER_FORM = "volunteer-form",
  VPA = "vpa",
  AGREEMENT = "agreement",
  ANNOUNCEMENT = "announcement",
  OPPORTUNITY_FORM = "opportunity-form",
  DATA_PROTECTION = "data-protection",
  GUIDELINES = "guidelines",
  RAC_GUIDELINES = "rac-guidelines",
}

export enum Env {
  DEVELOPMENT = "development",
  TEST = "test",
  PRODUCTION = "production",
}

export enum Language {
  DE = "de",
  EN = "en",
}

export enum LanguageLevel {
  NATIVE = "native",
  FLUENT = "fluent",
  INTERMEDIATE = "intermediate",
}

export type LanguageObject = {
  id: number;
  language: string;
  level: LanguageLevel | "";
  purpose?: import("need4deed-sdk").LangPurpose;
};

export type FooterLink = [string, string];

export type HttpMethod = "post" | "patch" | "put" | "delete";

export type IsEditing = { $isEditing: boolean };

export type HasError = { $hasError?: boolean };

export type HasHint = { $hasHint?: boolean };
