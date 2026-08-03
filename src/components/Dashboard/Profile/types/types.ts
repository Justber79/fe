import { ApiOpportunityGet, ApiVolunteerGet } from "need4deed-sdk";
import { ApiAgentProfileGet } from "./agent";

export type EntityType = "volunteer" | "opportunity" | "agent";

export type ProfileEntityProps =
  | { volunteer: ApiVolunteerGet; opportunity?: never; agent?: never; handleProfileNavigation?: never }
  | { opportunity: ApiOpportunityGet; volunteer?: never; agent?: never; handleProfileNavigation?: never }
  | {
      agent: ApiAgentProfileGet;
      volunteer?: never;
      opportunity?: never;
      handleProfileNavigation?: (direction: ProfileNavigationDirection) => void;
    };

export enum ProfileCardTypes {
  VOLUNTEER_HEADER = "VOLUNTEER_HEADER",
  CONTACT = "CONTACT",
  VOLUNTEER = "VOLUNTEER",
  OPPORTUNITIES = "OPPORTUNITIES",
  COORDINATE = "COORDINATE",
  DOCUMENTS = "DOCUMENTS",
  ACTIVITY = "ACTIVITY",
}

export interface ProfileCardProps {
  type: ProfileCardTypes;
  title: string;
}

export enum IconName {
  Baby = "baby",
  Bicycle = "bicycle",
  CalendarStar = "calendarStar",
  ChartLine = "chartLine",
  ChatCircleDots = "chatCircleDots",
  ChatsCircle = "chatsCircle",
  ChatsTeardrop = "chatsTeardrop",
  ClipboardText = "clipboardText",
  Gift = "gift",
  House = "house",
  PingPong = "pingPong",
  ShootingStar = "shootingStar",
  Sparkle = "sparkle",
  Trash = "trash",
  UserCheck = "userCheck",
  UserCircle = "userCircle",
  Users = "users",
  UsersThree = "usersThree",
  Wrench = "wrench",
}

export enum ProfileNavigationDirection {
  LEFT = "left",
  RIGHT = "right",
}

export const FadeDuration = 300;
