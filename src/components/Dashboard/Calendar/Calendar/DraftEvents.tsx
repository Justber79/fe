import { Heading3 } from "@/components/styled/text";
import type { ApiEventN4DGetList } from "need4deed-sdk";
import { useTranslation } from "react-i18next";

import { eventOccursOnDate, groupEventsByDate } from "@/utils/calendar";
import { EventCard } from "./EventCard";
import { DateGroup, DateHeading, SectionHeading } from "./styles";

interface Props {
  events: ApiEventN4DGetList[];
  selectedDateKey: string | null;
  onEdit: (event: ApiEventN4DGetList) => void;
  onDelete: (event: ApiEventN4DGetList) => void;
  onPublicationChange: (event: ApiEventN4DGetList) => void;
}

export function DraftEvents({ events, selectedDateKey, onEdit, onDelete, onPublicationChange }: Props) {
  const { t, i18n } = useTranslation();
  const groups = groupEventsByDate(events);

  if (!events.length) return null;

  return (
    <section>
      <SectionHeading>
        <Heading3>{t("dashboard.calendar.draftEvents")}</Heading3>
      </SectionHeading>
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
            <EventCard
              key={event.id}
              event={event}
              onEdit={onEdit}
              onDelete={onDelete}
              onPublicationChange={onPublicationChange}
            />
          ))}
        </DateGroup>
      ))}
    </section>
  );
}
