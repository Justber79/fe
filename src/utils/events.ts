import type { ApiEventN4DGetList } from "need4deed-sdk";

export function getUpcomingEvent(events?: ApiEventN4DGetList[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events
    ?.filter((event) => event.active && new Date(event.dateEnd ?? event.date) >= today)
    .sort((first, second) => new Date(first.date).getTime() - new Date(second.date).getTime())[0];
}

export function formatEventDate(event: ApiEventN4DGetList, locale: string) {
  const format = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const start = format.format(new Date(event.date));
  if (!event.dateEnd) return start;

  const end = format.format(new Date(event.dateEnd));
  return start === end ? start : `${start} – ${end}`;
}

export function getHttpUrl(value?: string) {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}
