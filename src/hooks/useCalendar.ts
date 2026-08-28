import type { ApiEventN4DGetList } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { dateKey, eventOccursOnDate } from "@/utils/calendar";
import { useDeleteEvent, useEvents } from "./useEvents";

export function useCalendar() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [monthDate, setMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [showPast, setShowPast] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<ApiEventN4DGetList | null>(null);
  const { data: events = [], isLoading, isError } = useEvents();
  const remove = useDeleteEvent(deletingEvent?.id);

  const monthEvents = useMemo(() => {
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);
    return events
      .filter((event) => new Date(event.date) < monthEnd && new Date(event.dateEnd ?? event.date) >= monthStart)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, monthDate]);
  const upcomingEvents = monthEvents.filter((event) => new Date(event.dateEnd ?? event.date) >= today);
  const pastEvents = monthEvents
    .filter((event) => new Date(event.dateEnd ?? event.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const createEvent = (date?: string) =>
    router.push(`/${i18n.language}/dashboard/calendar/create${date ? `?date=${date}` : ""}`);
  const editEvent = (event: ApiEventN4DGetList) => router.push(`/${i18n.language}/dashboard/calendar/${event.id}/edit`);

  const selectDate = (date: Date, hasEvents: boolean) => {
    const key = dateKey(date);
    setSelectedDateKey(key);
    if (!hasEvents) {
      createEvent(key);
      return;
    }
    const target = monthEvents.find((event) => eventOccursOnDate(event, key));
    if (target && pastEvents.some((event) => event.id === target.id)) setShowPast(true);
    window.requestAnimationFrame(() => {
      const targetKey = target ? dateKey(new Date(target.date)) : key;
      document.getElementById(`event-date-${targetKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const changeMonth = (offset: number) => {
    const next = new Date(monthDate.getFullYear(), monthDate.getMonth() + offset, 1);
    setMonthDate(next);
    setShowPast(next < new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateKey(null);
  };

  return {
    monthDate,
    monthEvents,
    upcomingEvents,
    pastEvents,
    selectedDateKey,
    showPast,
    deletingEvent,
    isLoading,
    isError,
    createEvent,
    editEvent,
    selectDate,
    previousMonth: () => changeMonth(-1),
    nextMonth: () => changeMonth(1),
    togglePast: () => setShowPast((value) => !value),
    requestDelete: setDeletingEvent,
    cancelDelete: () => setDeletingEvent(null),
    confirmDelete: () => {
      if (deletingEvent) remove.mutate(undefined, { onSettled: () => setDeletingEvent(null) });
    },
  };
}
