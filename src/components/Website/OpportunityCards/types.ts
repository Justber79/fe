import { Dispatch, SetStateAction } from "react";
import { Lang, OpportunityLegacyType, TranslatedIntoType } from "need4deed-sdk";

// The endpoint also sends "events", which OpportunityLegacyType doesn't list.
export type LegacyOpportunityType = OpportunityLegacyType | "events";

/** Shape returned by `GET /opportunity/legacy` (the old website's data source). */
export interface LegacyTimeslot {
  day: number; // 1 = Monday … 7 = Sunday
  time_slot: string;
}

export interface OpportunityApi {
  accomp_datetime: string | null;
  accomp_information: string | null;
  accomp_translation: TranslatedIntoType | null;
  activities: string[];
  berlin_locations: string[];
  created_at: string;
  datetime_str: string | null;
  id: number;
  languages: string[];
  opportunity_type: LegacyOpportunityType;
  schedule_str: string | null;
  skills: string[];
  status: string;
  timeslots: LegacyTimeslot[];
  title: string;
  updated_at: string;
  vo_information: string | null;
  category_id: number | null;
  category: string | null;
  last_edited_time_notion: string | null;
}

export interface Opportunity {
  accompanyingDate: Date | null;
  accompanyingInfo: string | null;
  accompanyingTranslation: string;
  activities: string[];
  createdAt: Date;
  datetime: string | null;
  id: number;
  languages: string[];
  locations: string[];
  opportunityType: LegacyOpportunityType;
  schedule: string | null;
  skills: string[];
  status: string;
  timeslots: LegacyTimeslot[];
  title: string;
  updatedAt: Date;
  voInformation: string | null;
  categoryId: number | null;
  category: string;
  lastEditedTimeNotion: Date;
  defaultMainCommunication: string;
}

export interface OpportunityParams {
  search?: Record<string, string[]>;
  primaryKeys?: string[];
  language?: Lang;
}

export interface CardsFilter {
  searchInput: string;
  accompanying: boolean;
  activityType: Record<string, boolean>;
  district: Record<string, boolean>;
  days: Days;
}

export interface Days {
  monday: Day;
  tuesday: Day;
  wednesday: Day;
  thursday: Day;
  friday: Day;
  saturday: Day;
  sunday: Day;
}

export interface Day {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
}

export type DaysKeys = keyof Days;
export type DayKeys = keyof Day;
export type CardFilterKeys = keyof CardsFilter;

export type SetFilter = Dispatch<SetStateAction<CardsFilter>>;
