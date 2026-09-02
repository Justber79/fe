import { Heading3, Paragraph } from "@/components/styled/text";
import { ConfirmationDialog } from "@/components/Dashboard/Profile/sections/shared/ConfirmationDialog";
import type { ApiEventN4DGetList } from "need4deed-sdk";
import { useTranslation } from "react-i18next";

import { CalendarGrid } from "./CalendarGrid";
import { PastEvents } from "./PastEvents";
import { UpcomingEvents } from "./UpcomingEvents";
import { Agenda, CalendarAside, Layout, SectionHeading } from "./styles";

interface Props {
  events: ApiEventN4DGetList[];
  upcomingEvents: ApiEventN4DGetList[];
  pastEvents: ApiEventN4DGetList[];
  monthDate: Date;
  selectedDateKey: string | null;
  showPast: boolean;
  isLoading: boolean;
  isError: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onDateClick: (date: Date, hasEvents: boolean) => void;
  onTogglePast: () => void;
  onEdit: (event: ApiEventN4DGetList) => void;
  onDelete: (event: ApiEventN4DGetList) => void;
  deletingEvent: ApiEventN4DGetList | null;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export function Calendar(props: Props) {
  const { t } = useTranslation();
  return (
    <Layout>
      <CalendarAside>
        <SectionHeading>
          <Heading3>{t("dashboard.calendar.calendarTitle")}</Heading3>
          <Paragraph>{t("dashboard.calendar.calendarHelp")}</Paragraph>
        </SectionHeading>
        <CalendarGrid
          events={props.events}
          monthDate={props.monthDate}
          selectedDateKey={props.selectedDateKey}
          onPreviousMonth={props.onPreviousMonth}
          onNextMonth={props.onNextMonth}
          onDateClick={props.onDateClick}
        />
      </CalendarAside>
      <Agenda>
        <UpcomingEvents
          events={props.upcomingEvents}
          hasMonthEvents={props.events.length > 0}
          selectedDateKey={props.selectedDateKey}
          isLoading={props.isLoading}
          isError={props.isError}
          onEdit={props.onEdit}
          onDelete={props.onDelete}
        />
        <PastEvents
          events={props.pastEvents}
          selectedDateKey={props.selectedDateKey}
          expanded={props.showPast}
          onToggle={props.onTogglePast}
          onEdit={props.onEdit}
          onDelete={props.onDelete}
        />
      </Agenda>
      {props.deletingEvent && (
        <ConfirmationDialog
          title={t("dashboard.calendar.deleteConfirmTitle")}
          message={t("dashboard.calendar.deleteConfirmText", { title: props.deletingEvent.title })}
          confirmText={t("dashboard.calendar.deleteEvent")}
          cancelText={t("dashboard.calendar.createForm.cancel")}
          compact
          onCancel={props.onCancelDelete}
          onConfirm={props.onConfirmDelete}
        />
      )}
    </Layout>
  );
}
