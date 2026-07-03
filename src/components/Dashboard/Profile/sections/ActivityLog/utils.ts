import { ApiActivityLogEntry } from "need4deed-sdk";

export const sumHours = (entries: ApiActivityLogEntry[]): number =>
  entries.reduce((total, entry) => total + (Number(entry.hours) || 0), 0);

export const formatHours = (hours: number): string => parseFloat(hours.toFixed(2)).toString();
