import { Availability } from "@/components/forms/types";
import { getScheduleState } from "@/components/forms/utils";
import { ApiAvailability, Occasionally } from "need4deed-sdk";
import { DAY_MAP, REVERSE_DAY_MAP } from "./constants";

export function apiToFormAvailability(apiAvailability: ApiAvailability[] | undefined): Availability {
  const formAvailability = getScheduleState();

  if (!apiAvailability) return formAvailability;

  apiAvailability.forEach((avail) => {
    if (!avail.daytime) return;

    if (avail.day === Occasionally.OCCASIONALLY) {
      const dayIndex = formAvailability.findIndex((d) => d.weekday === 0);
      if (dayIndex !== -1) {
        const slotIndex = formAvailability[dayIndex].timeSlots.findIndex((s) => s.id === avail.daytime);
        if (slotIndex !== -1) {
          formAvailability[dayIndex].timeSlots[slotIndex].selected = true;
        }
      }
      return;
    }

    const weekdayNum = REVERSE_DAY_MAP[avail.day as string];
    if (!weekdayNum) return;

    const dayIndex = formAvailability.findIndex((d) => d.weekday === weekdayNum);
    if (dayIndex === -1) return;

    const slotIndex = formAvailability[dayIndex].timeSlots.findIndex((s) => s.id === avail.daytime);
    if (slotIndex !== -1) {
      formAvailability[dayIndex].timeSlots[slotIndex].selected = true;
    }
  });

  return formAvailability;
}

export function formToApiAvailability(formAvailability: Availability): ApiAvailability[] {
  const result: ApiAvailability[] = [];

  formAvailability.forEach((day) => {
    day.timeSlots.forEach((slot) => {
      if (!slot.selected) return;

      if (day.weekday === 0) {
        result.push({
          day: Occasionally.OCCASIONALLY,
          daytime: slot.id,
        });
        return;
      }

      if (day.weekday >= 1 && day.weekday <= 7) {
        result.push({
          day: DAY_MAP[day.weekday],
          daytime: slot.id,
        });
      }
    });
  });

  return result;
}
