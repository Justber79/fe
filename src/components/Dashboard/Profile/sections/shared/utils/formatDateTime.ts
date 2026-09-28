import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { format, parseISO } from "date-fns";

export const formatDateTime = (date: Date) => {
  if (!date) return EMPTY_PLACEHOLDER_VALUE;
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd.MM.yyyy HH:mm");
};
