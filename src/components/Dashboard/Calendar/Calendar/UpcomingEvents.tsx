import { Heading3 } from "@/components/styled/text";
import type { ApiEventN4DGetList } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { eventOccursOnDate, groupEventsByDate } from "@/utils/calendar";
import { EventCard } from "./EventCard";
import { DateGroup, DateHeading, SectionHeading, State } from "./styles";

const INITIAL_EVENT_COUNT = 3;

interface Props {
  events: ApiEventN4DGetList[];
  selectedDateKey: string | null;
  isLoading: boolean;
  isError: boolean;
  onEdit: (event: ApiEventN4DGetList) => void;
  onDelete: (event: ApiEventN4DGetList) => void;
}

export function UpcomingEvents({ events, selectedDateKey, isLoading, isError, onEdit, onDelete }: Props) {
  const { t, i18n } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const visibleEvents = showAll ? events : events.slice(0, INITIAL_EVENT_COUNT);
  const groups = groupEventsByDate(visibleEvents);

  return (
    <>
      <SectionHeading>
        <Heading3>{t("dashboard.calendar.upcomingEvents")}</Heading3>
      </SectionHeading>
      {isLoading && <State>{t("dashboard.calendar.loading")}</State>}
      {isError && <State>{t("dashboard.calendar.loadError")}</State>}
      {!isLoading && !isError && !events.length && (
        <State>
          <Heading3>{t("dashboard.calendar.noUpcomingEvents")}</Heading3>
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
      {!showAll && events.length > INITIAL_EVENT_COUNT && (
        <ShowMoreButton type="button" onClick={() => setShowAll(true)}>
          {t("dashboard.calendar.showMoreEvents")}
        </ShowMoreButton>
      )}
    </>
  );
}

const ShowMoreButton = styled.button`
  display: block;
  width: 100%;
  padding: var(--spacing-12) var(--spacing-16);
  border: var(--border-width-medium) solid var(--color-aubergine);
  border-radius: var(--border-radius-large);
  background: var(--color-white);
  color: var(--color-aubergine);
  cursor: pointer;
  font: inherit;
  font-weight: var(--font-weight-semibold);

  &:hover,
  &:focus-visible {
    background: var(--color-orchid-subtle);
  }
`;
