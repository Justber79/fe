import type { ApiEventN4DGetList } from "need4deed-sdk";

export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function eventDateKeys(event: ApiEventN4DGetList) {
  const start = new Date(event.date);
  const end = new Date(event.dateEnd ?? event.date);
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const keys: string[] = [];
  while (cursor <= last) {
    keys.push(dateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
}

export function eventOccursOnDate(event: ApiEventN4DGetList, key: string) {
  return eventDateKeys(event).includes(key);
}

export function calendarCells(year: number, month: number) {
  const first = (new Date(year, month, 1).getDay() + 6) % 7;
  const previous = new Date(year, month, 0).getDate();
  const count = new Date(year, month + 1, 0).getDate();
  const result: { day: number; current: boolean }[] = [];
  for (let index = first - 1; index >= 0; index--) result.push({ day: previous - index, current: false });
  for (let day = 1; day <= count; day++) result.push({ day, current: true });
  for (let day = 1; result.length < 42; day++) result.push({ day, current: false });
  return result;
}

export function eventDateRange(event: ApiEventN4DGetList, locale: string) {
  const start = new Date(event.date);
  const end = event.dateEnd ? new Date(event.dateEnd) : undefined;
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
  const startDate = start.toLocaleDateString(locale, dateOptions);
  const startTime = start.toLocaleTimeString(locale, timeOptions);
  if (!end) return `${startDate} · ${startTime}`;
  const endTime = end.toLocaleTimeString(locale, timeOptions);
  if (dateKey(start) === dateKey(end)) return `${startDate} · ${startTime}–${endTime}`;
  return `${startDate} · ${startTime} – ${end.toLocaleDateString(locale, dateOptions)} · ${endTime}`;
}

export function groupEventsByDate(events: ApiEventN4DGetList[]) {
  return events.reduce<Record<string, ApiEventN4DGetList[]>>((groups, event) => {
    const key = dateKey(new Date(event.date));
    groups[key] = [...(groups[key] ?? []), event];
    return groups;
  }, {});
}
