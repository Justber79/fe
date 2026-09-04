import Button from "@/components/core/button/Button/Button";
import { CalendarBlankIcon, LinkIcon, MapPinIcon } from "@phosphor-icons/react";
import type { ApiEventN4DGetList } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { eventDateRange } from "@/utils/calendar";
import { getHttpUrl } from "@/utils/events";

interface Props {
  event: ApiEventN4DGetList;
  variant?: "card" | "bar";
  onEdit: (event: ApiEventN4DGetList) => void;
  onDelete: (event: ApiEventN4DGetList) => void;
}

export function EventCard({ event, variant = "card", onEdit, onDelete }: Props) {
  const { t, i18n } = useTranslation();
  const registrationUrl = getHttpUrl(event.linkRSVP);

  if (variant === "bar") {
    return (
      <Bar>
        <BarDetails>
          <strong>{event.title}</strong>
          <time>{eventDateRange(event, i18n.language)}</time>
        </BarDetails>
        <BarActions>
          <TextButton type="button" onClick={() => onEdit(event)}>
            {t("dashboard.calendar.editEvent")}
          </TextButton>
          <TextButton type="button" onClick={() => onDelete(event)}>
            {t("dashboard.calendar.deleteEvent")}
          </TextButton>
        </BarActions>
      </Bar>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <h4>{event.title}</h4>
          {event.shortDescription && <Description>{event.shortDescription}</Description>}
        </div>
        <Status $active={event.active}>
          {t(event.active ? "dashboard.calendar.published" : "dashboard.calendar.draft")}
        </Status>
      </CardHeader>
      <Meta>
        <CalendarBlankIcon size={18} />
        {eventDateRange(event, i18n.language)}
      </Meta>
      <Meta>
        <MapPinIcon size={18} />
        {event.address}
      </Meta>
      <Meta>
        <LinkIcon size={18} />
        {registrationUrl ? (
          <Registration href={registrationUrl} target="_blank" rel="noopener noreferrer">
            {t("dashboard.calendar.openRegistration")}
          </Registration>
        ) : (
          <span>{t("dashboard.calendar.registrationUnavailable")}</span>
        )}
      </Meta>
      <Actions>
        <Button
          text={t("dashboard.calendar.editEvent")}
          onClick={() => onEdit(event)}
          height="40px"
          width="auto"
          textFontSize="var(--font-size-sm)"
          padding="var(--spacing-8) var(--spacing-16)"
          backgroundcolor="transparent"
          border="var(--border-width-medium) solid var(--color-aubergine)"
          textColor="var(--color-aubergine)"
        />
        <Button
          text={t("dashboard.calendar.deleteEvent")}
          onClick={() => onDelete(event)}
          height="40px"
          width="auto"
          textFontSize="var(--font-size-sm)"
          padding="var(--spacing-8) var(--spacing-16)"
        />
      </Actions>
    </Card>
  );
}

const Card = styled.article`
  padding: var(--spacing-20);
  margin-bottom: var(--spacing-12);
  border: var(--border-width-thin) solid var(--color-orchid);
  border-radius: var(--border-radius-large);
  background: var(--color-white);
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-16);
  h4 {
    margin: 0;
    font-size: var(--font-size-md);
    color: var(--color-midnight);
  }
`;
const Description = styled.p`
  margin: var(--spacing-8) 0 var(--spacing-12);
  color: var(--color-midnight);
  line-height: 1.5;
`;
const Status = styled.span<{ $active: boolean }>`
  height: max-content;
  padding: var(--spacing-4) var(--spacing-8);
  border-radius: var(--border-radius-small);
  background: var(--color-orchid-subtle);
  color: ${({ $active }) => ($active ? "var(--color-green-700)" : "var(--color-grey-500)")};
  font-size: var(--font-size-xs);
  font-weight: bold;
`;
const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  margin-top: var(--spacing-8);
  color: var(--color-midnight);
`;
const Registration = styled.a`
  color: var(--color-midnight);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const Actions = styled.div`
  display: flex;
  gap: var(--spacing-12);
  flex-wrap: wrap;
  margin-top: var(--spacing-16);
  padding-top: var(--spacing-12);
  border-top: var(--border-width-thin) solid var(--color-grey-200);
`;
const Bar = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-16);
  padding: var(--spacing-12) var(--spacing-16);
  border-bottom: var(--border-width-thin) solid var(--color-grey-200);
  background: var(--color-white);
`;
const BarDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  min-width: 0;
  time {
    color: var(--color-grey-500);
    font-size: var(--font-size-xs);
  }
`;
const BarActions = styled.div`
  display: flex;
  gap: var(--spacing-8);
`;
const TextButton = styled.button`
  border: 0;
  background: transparent;
  color: var(--color-aubergine);
  cursor: pointer;
  font-weight: bold;
`;
