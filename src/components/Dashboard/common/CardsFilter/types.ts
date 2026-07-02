import { Dispatch, SetStateAction } from "react";
import { ByDay, OccasionalType, TimeSlot } from "need4deed-sdk";

export type SetFilter<TFilter> = Dispatch<SetStateAction<TFilter>>;

export type SelectionMap = Record<string, boolean>;

export interface ScheduleFilter {
  times: Record<TimeSlot, boolean>;
  days: Record<ByDay, boolean>;
  occasional: Record<OccasionalType, boolean>;
}

export type FilterItem = {
  label: string;
  checked: unknown;
  onChange: (checked: boolean) => void;
  keyValue: string;
  parentKey?: string;
};
