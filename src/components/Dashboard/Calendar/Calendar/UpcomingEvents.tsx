import Button from "@/components/core/button/Button/Button";
import { Heading3, Paragraph } from "@/components/styled/text";
import type { ApiEventN4DGetList } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { EventDateGroups } from "./EventDateGroups";
import { SectionHeading, State } from "./styles";

const INITIAL_EVENT_COUNT = 3;

interface Props {
  events: ApiEventN4DGetList[];
  hasAnyEvents: boolean;
  selectedDateKey: string | null;
  isLoading: boolean;
  isError: boolean;
  onEdit: (event: ApiEventN4DGetList) => void;
  onDelete: (event: ApiEventN4DGetList) => void;
  onPublicationChange: (event: ApiEventN4DGetList) => void;
}

export function UpcomingEvents({
  events,
  hasAnyEvents,
  selectedDateKey,
  isLoading,
  isError,
  onEdit,
  onDelete,
  onPublicationChange,
}: Props) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const visibleEvents = showAll ? events : events.slice(0, INITIAL_EVENT_COUNT);

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
            {t(hasAnyEvents ? "dashboard.calendar.noUpcomingEvents" : "dashboard.calendar.emptyTitle")}
          </Heading3>
          {!hasAnyEvents && <Paragraph>{t("dashboard.calendar.emptyText")}</Paragraph>}
        </State>
      )}
      <EventDateGroups
        events={visibleEvents}
        section="upcoming"
        selectedDateKey={selectedDateKey}
        onEdit={onEdit}
        onDelete={onDelete}
        onPublicationChange={onPublicationChange}
      />
      {!showAll && events.length > INITIAL_EVENT_COUNT && (
        <Button
          width="100%"
          backgroundcolor="var(--color-white)"
          border="var(--border-width-medium) solid var(--color-aubergine)"
          textColor="var(--color-aubergine)"
          text={t("dashboard.calendar.showMoreEvents")}
          onClick={() => setShowAll(true)}
        />
      )}
    </>
  );
}
