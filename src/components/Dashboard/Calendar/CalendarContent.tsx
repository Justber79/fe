"use client";

import { Heading2 } from "@/components/styled/text";
import { useCalendar } from "@/hooks";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Calendar } from "./Calendar/index";
import { CreateEventCta } from "./CreateEventCta";

export function CalendarContent() {
  const { t } = useTranslation();
  const calendar = useCalendar();

  return (
    <Page>
      <PageHeading>
        <Heading2>{t("dashboard.calendar.calendarTitle")}</Heading2>
        <CreateEventCta onCreate={() => calendar.createEvent(calendar.selectedDateKey ?? undefined)} />
      </PageHeading>
      <Calendar
        events={calendar.monthEvents}
        upcomingEvents={calendar.upcomingEvents}
        pastEvents={calendar.pastEvents}
        monthDate={calendar.monthDate}
        selectedDateKey={calendar.selectedDateKey}
        showPast={calendar.showPast}
        isLoading={calendar.isLoading}
        isError={calendar.isError}
        onPreviousMonth={calendar.previousMonth}
        onNextMonth={calendar.nextMonth}
        onDateClick={calendar.selectDate}
        onTogglePast={calendar.togglePast}
        onEdit={calendar.editEvent}
        onDelete={calendar.requestDelete}
        deletingEvent={calendar.deletingEvent}
        onCancelDelete={calendar.cancelDelete}
        onConfirmDelete={calendar.confirmDelete}
      />
    </Page>
  );
}

const Page = styled.div`
  padding: var(--spacing-32) var(--spacing-48) var(--spacing-48);
  width: 100%;
  box-sizing: border-box;
  color: var(--color-midnight);
  @media (max-width: 600px) {
    padding: var(--spacing-24) var(--spacing-16) var(--spacing-32);
  }
`;

const PageHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-24);
  margin-bottom: var(--spacing-32);
`;
