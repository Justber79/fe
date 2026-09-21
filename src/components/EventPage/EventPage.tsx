"use client";

import { Button } from "@/components/core/button";
import { PageLayout } from "@/components/Layout";
import { Body, Description, Detail, Details, EventCard, Hero, PageContent } from "@/components/styled/eventPageLayout";
import { Heading1, Heading2, Paragraph } from "@/components/styled/text";
import { useEvents } from "@/hooks/useEvents";
import { eventDateRange } from "@/utils/calendar";
import { getHttpUrl, getUpcomingEvent } from "@/utils/events";
import { CalendarBlankIcon, MapPinIcon } from "@phosphor-icons/react";
import { EventN4DType } from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const EventType = styled.span`
  display: inline-flex;
  margin-bottom: var(--spacing-20);
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--color-midnight);
  color: var(--color-white);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: capitalize;
`;

const Subtitle = styled(Paragraph)`
  margin-top: var(--spacing-12);
`;

const AdditionalInfo = styled.ul`
  margin: var(--spacing-20) 0 0;
  padding-left: 20px;
  color: var(--color-midnight);
`;

const EmptyState = styled.div`
  padding: clamp(40px, 8vw, 96px) 24px;
  text-align: center;
`;

export function EventPage() {
  const { t, i18n } = useTranslation();
  const { data: events, isError, isLoading } = useEvents();
  const event = useMemo(() => getUpcomingEvent(events), [events]);
  const registrationUrl = getHttpUrl(event?.linkRSVP);
  const eventTypeLabel =
    event?.type === EventN4DType.PARTY
      ? t("dashboard.calendar.createForm.typeParty")
      : t("dashboard.calendar.createForm.typeWorkshop");

  return (
    <PageLayout>
      <PageContent>
        {isLoading ? (
          <EmptyState aria-live="polite">
            <Heading2>{t("eventPage.loading")}</Heading2>
          </EmptyState>
        ) : isError ? (
          <EmptyState role="alert">
            <Heading2>{t("eventPage.loadError")}</Heading2>
          </EmptyState>
        ) : event ? (
          <EventCard>
            <Hero>
              <EventType>{eventTypeLabel}</EventType>
              <Heading1 margin={0}>{event.title}</Heading1>
              {event.subTitle && <Subtitle fontSize="var(--font-size-lg)">{event.subTitle}</Subtitle>}
            </Hero>

            <Body>
              <section>
                <Heading2>{t("eventPage.about")}</Heading2>
                <Description>{event.description}</Description>
                {event.additionalInfo?.length ? (
                  <>
                    {event.additionalTitle && (
                      <Heading2 margin="var(--spacing-32) 0 0">{event.additionalTitle}</Heading2>
                    )}
                    <AdditionalInfo>
                      {event.additionalInfo.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </AdditionalInfo>
                  </>
                ) : null}
              </section>

              <Details aria-label={t("eventPage.details")}>
                <Detail>
                  <CalendarBlankIcon size={22} aria-hidden />
                  <span>
                    {eventDateRange(event, i18n.language, "Europe/Berlin")} {t("eventPage.berlinTime")}
                  </span>
                </Detail>
                <Detail>
                  <MapPinIcon size={22} aria-hidden />
                  <span>
                    {event.address}
                    {event.locationComment && (
                      <>
                        <br />
                        {event.locationComment}
                      </>
                    )}
                  </span>
                </Detail>
                {registrationUrl ? (
                  <Button
                    text={t("eventPage.register")}
                    width="100%"
                    onClick={() => window.open(registrationUrl, "_blank", "noopener,noreferrer")}
                  />
                ) : (
                  <Paragraph>{t("eventPage.registrationUnavailable")}</Paragraph>
                )}
              </Details>
            </Body>
          </EventCard>
        ) : (
          <EmptyState aria-live="polite">
            <Heading2>{t("eventPage.empty")}</Heading2>
            <Paragraph margin="var(--spacing-12) 0 0">{t("eventPage.emptyDescription")}</Paragraph>
          </EmptyState>
        )}
      </PageContent>
    </PageLayout>
  );
}

export default EventPage;
