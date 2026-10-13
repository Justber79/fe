import { ApiVolunteerGetList } from "need4deed-sdk";

export const EntityType = {
  VOLUNTEER: "volunteer",
  OPPORTUNITY: "opportunity",
} as const;

export type EntityType = (typeof EntityType)[keyof typeof EntityType];

export type SingleFilter = {
  id: number | string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  languages: ApiVolunteerGetList["languages"];
  availability: ApiVolunteerGetList["availability"];
  avatarUrl?: string;
};

export type EntityMarker = {
  lat: number;
  lon: number;
  label: string;
  children?: Array<{ title: string; link: string; language: string; availability: string }>;
  onClick: () => null;
  entity: EntityType;
  avatarUrl?: string;
};

export type SingleMarker = {
  lat: number;
  lon: number;
  label: string;
  title: string;
  link: string;
  language: string;
  availability: string;
  onClick: () => null;
  entity: EntityType;
  avatarUrl?: string;
};

export type BerlinRacMarker = {
  id: string;
  lat: number;
  lon: number;
  type: string;
  district: string;
  area: string;
  street: string;
};
