import { Heading3, Paragraph } from "@/components/styled/text";
import type { ApiEventN4DGetList } from "need4deed-sdk";
import { useTranslation } from "react-i18next";

import { eventOccursOnDate, groupEventsByDate } from "@/utils/calendar";
import { EventCard } from "./EventCard";
import { DateGroup, DateHeading, SectionHeading, State } from "./styles";

interface Props {
  events: ApiEventN4DGetList[];
  hasMonthEvents: boolean;
  selectedDateKey: string | null;
  isLoading: boolean;
  isError: boolean;
  onEdit: (event: ApiEventN4DGetList) => void;
  onDelete: (event: ApiEventN4DGetList) => void;
}

export function UpcomingEvents({
  events,
  hasMonthEvents,
  selectedDateKey,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: Props) {
  const { t, i18n } = useTranslation();
  const groups = groupEventsByDate(events);

  return (
    <>
      <SectionHeading>
        <Heading3>{t("dashboard.calendar.upcomingEvents")}</Heading3>
      </SectionHeading>
      {isLoading && <State>{t("dashboard.calendar.loading")}</State>}
      {isError && <State>{t("dashboard.calendar.loadError")}</State>}
      {!isLoading && !isError && !events.length && (
        <State>
          <Heading3>
            {t(hasMonthEvents ? "dashboard.calendar.noUpcomingEvents" : "dashboard.calendar.emptyTitle")}
          </Heading3>
          {!hasMonthEvents && <Paragraph>{t("dashboard.calendar.emptyText")}</Paragraph>}
        </State>
      )}
      {Object.entries(groups).map(([key, groupedEvents]) => (
        <DateGroup
          id={`event-date-${key}`}
          key={key}
          $selected={Boolean(
            selectedDateKey && groupedEvents.some((event) => eventOccursOnDate(event, selectedDateKey)),
          )}
        >
          <DateHeading>
            {new Date(groupedEvents[0].date).toLocaleDateString(i18n.language, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </DateHeading>
          {groupedEvents.map((event) => (
            <EventCard key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </DateGroup>
      ))}
    </>
  );
}
