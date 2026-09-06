import { Availability } from "@/components/forms/types/availabilityTypes";
import { getScheduleState } from "../forms/utils";
import { LanguageObject } from "@/types";
import { OptionById, OptionId } from "need4deed-sdk";

export interface DefaultVolunteerRegistrationData {
  addressPostcode: string;
  locations: number[];
  languages: LanguageObject[];
  availability: Availability;
  activities: number[];
  skills: number[];
  leadFrom: number[];
  goodConductCertificate: boolean | undefined;
  measlesVaccination: boolean | undefined;
  comments: string;
}

export const defaultVolunteerRegistrationData: DefaultVolunteerRegistrationData = {
  addressPostcode: "",
  locations: [],
  languages: [{ id: 0, language: "", level: "" }],
  availability: getScheduleState(),
  activities: [],
  skills: [],
  leadFrom: [],
  goodConductCertificate: undefined,
  measlesVaccination: undefined,
  comments: "",
};

export const TOTAL_STEPS = 1;
export const TOTAL_COMPLETION_STEPS = 3;
