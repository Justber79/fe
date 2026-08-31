import { CaretDownIcon } from "@phosphor-icons/react";
import type { ApiEventN4DGetList } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { eventOccursOnDate, groupEventsByDate } from "@/utils/calendar";
import { EventCard } from "./EventCard";
import { DateGroup, DateHeading } from "./styles";

interface Props {
  events: ApiEventN4DGetList[];
  selectedDateKey: string | null;
  expanded: boolean;
  onToggle: () => void;
  onEdit: (event: ApiEventN4DGetList) => void;
  onDelete: (event: ApiEventN4DGetList) => void;
}

export function PastEvents({ events, selectedDateKey, expanded, onToggle, onEdit, onDelete }: Props) {
  const { t, i18n } = useTranslation();
  const groups = groupEventsByDate(events);
  return (
    <Past>
      <PastToggle type="button" onClick={onToggle} aria-expanded={expanded}>
        <strong>{t("dashboard.calendar.pastEvents")}</strong>
        <CaretDownIcon size={20} />
      </PastToggle>
      {expanded &&
        (events.length ? (
          Object.entries(groups).map(([key, groupedEvents]) => (
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
                <EventCard key={event.id} event={event} variant="bar" onEdit={onEdit} onDelete={onDelete} />
              ))}
            </DateGroup>
          ))
        ) : (
          <Empty>{t("dashboard.calendar.noPastEvents")}</Empty>
        ))}
    </Past>
  );
}

const Past = styled.div`
  margin-top: var(--spacing-24);
`;
const PastToggle = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border: 0;
  border-bottom: var(--border-width-thin) solid var(--color-grey-300);
  background: transparent;
  padding: var(--spacing-12) 0;
  color: var(--color-midnight);
  cursor: pointer;
  strong {
    font-size: var(--text-h3-font-size);
    line-height: var(--text-h3-line-height);
  }
`;
const Empty = styled.p`
  color: var(--color-midnight);
`;
