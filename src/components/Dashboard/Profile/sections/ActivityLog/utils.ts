import { ApiActivityLogGet } from "./types";

export const sumHours = (entries: ApiActivityLogGet[]): number =>
  entries.reduce((total, entry) => total + (Number(entry.hours) || 0), 0);

export const formatHours = (hours: number): string => parseFloat(hours.toFixed(2)).toString();
