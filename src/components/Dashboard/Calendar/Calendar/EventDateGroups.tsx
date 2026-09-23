import type { ApiEventN4DGetList } from "need4deed-sdk";
import { useTranslation } from "react-i18next";

import { eventOccursOnDate, groupEventsByDate } from "@/utils/calendar";
import { EventCard } from "./EventCard";
import { DateGroup, DateHeading } from "./styles";

type Section = "draft" | "upcoming" | "past";

interface Props {
  events: ApiEventN4DGetList[];
  section: Section;
  selectedDateKey: string | null;
  variant?: "card" | "bar";
  onEdit: (event: ApiEventN4DGetList) => void;
  onDelete: (event: ApiEventN4DGetList) => void;
  onPublicationChange: (event: ApiEventN4DGetList) => void;
}

export function EventDateGroups({
  events,
  section,
  selectedDateKey,
  variant,
  onEdit,
  onDelete,
  onPublicationChange,
}: Props) {
  const { i18n } = useTranslation();
  const groups = groupEventsByDate(events);

  return Object.entries(groups).map(([key, groupedEvents]) => (
    <DateGroup
      id={`event-date-${section}-${key}`}
      key={key}
      $selected={Boolean(selectedDateKey && groupedEvents.some((event) => eventOccursOnDate(event, selectedDateKey)))}
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
          variant={variant}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublicationChange={onPublicationChange}
        />
      ))}
    </DateGroup>
  ));
}
