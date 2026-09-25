import { CardFilterKeys, CardsFilter, Day } from "./types";

const noSlots = (): Day => ({ morning: false, afternoon: false, evening: false });

export const defaultFilter: CardsFilter = {
  searchInput: "",
  accompanying: false,
  activityType: {},
  district: {},
  days: {
    monday: noSlots(),
    tuesday: noSlots(),
    wednesday: noSlots(),
    thursday: noSlots(),
    friday: noSlots(),
    saturday: noSlots(),
    sunday: noSlots(),
  },
};

export const FILTER_KEY = {
  SEARCH_INPUT: "searchInput",
  ACTIVITY_TYPE: "activityType",
  DISTRICT: "district",
  DAYS: "days",
  ACCOMPANYING: "accompanying",
} as const satisfies Record<string, CardFilterKeys>;

export const FILTER_KEY_LIST = Object.values(FILTER_KEY);

export type FilterKey = (typeof FILTER_KEY)[keyof typeof FILTER_KEY];

export const DASH = "-";

export const langQueryParamKey = "language";

export enum CategoryTitle {
  ACCOMPANYING = 6,
  SPORT_ACTIVITIES = 5,
  EVENTS = 4,
  SKILLS_BASED = 3,
  CHILD_CARE = 2,
  DE_LNG_SUPPORT = 1,
}

// `time_slot` values the legacy endpoint returns in `timeslots`.
export enum LegacyTimeSlot {
  MORNING = "08-11",
  NOON = "11-14",
  AFTERNOON = "14-17",
  EVENING = "17-20",
}

export const volunteerContactEmail = "volunteer@need4deed.org";
