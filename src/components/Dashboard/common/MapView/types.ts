import {
  ApiDistrictMarker,
  ApiDistrictMarkerChild,
  ApiOpportunityGetList,
  ApiVolunteerGetList,
  EntityTableName,
} from "need4deed-sdk";

export const MapEntity = {
  AGENT: EntityTableName.AGENT,
  OPPORTUNITY: EntityTableName.OPPORTUNITY,
  VOLUNTEER: EntityTableName.VOLUNTEER,
} as const;

export type MapEntity = (typeof MapEntity)[keyof typeof MapEntity];

export type SingleFilter = {
  id: ApiVolunteerGetList["id"] | ApiOpportunityGetList["id"];
  name: string;
  latitude: ApiVolunteerGetList["lat"];
  longitude: ApiVolunteerGetList["lon"];
  languages: ApiVolunteerGetList["languages"] | ApiOpportunityGetList["languages"];
  availability: ApiVolunteerGetList["availability"] | ApiOpportunityGetList["availability"];
  avatarUrl?: string;
};

export type EntityMarker = Omit<ApiDistrictMarker, "lat" | "lon" | "children"> & {
  lat: NonNullable<ApiDistrictMarker["lat"]>;
  lon: NonNullable<ApiDistrictMarker["lon"]>;
  label: string;
  children: Array<
    Omit<ApiDistrictMarkerChild, "languages" | "availability" | "type" | "district"> & {
      link: string;
      language?: string;
      availability?: string;
      type?: string;
      district?: string;
    }
  >;
};

export type SingleMarker = {
  lat: NonNullable<ApiVolunteerGetList["lat"]>;
  lon: NonNullable<ApiVolunteerGetList["lon"]>;
  label: string;
  title: ApiVolunteerGetList["name"] | ApiOpportunityGetList["title"];
  link: string;
  language: string;
  availability: string;
  entity: typeof MapEntity.OPPORTUNITY | typeof MapEntity.VOLUNTEER;
  avatarUrl?: ApiVolunteerGetList["avatarUrl"];
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
