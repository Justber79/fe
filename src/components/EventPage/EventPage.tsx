"use client";

import { Button } from "@/components/core/button";
import { PageLayout } from "@/components/Layout";
import { Heading1, Heading2, Paragraph } from "@/components/styled/text";
import { useEvents } from "@/hooks/useEvents";
import { formatEventDate, getHttpUrl, getUpcomingEvent } from "@/utils/events";
import { CalendarBlankIcon, MapPinIcon } from "@phosphor-icons/react";
import { EventN4DType } from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const PageContent = styled.main`
  width: min(100% - 32px, 960px);
  margin: 0 auto;
  padding: clamp(40px, 7vw, 88px) 0;
`;

const EventCard = styled.article`
  overflow: hidden;
  border: 1px solid var(--color-orchid-light, var(--color-orchid));
  border-radius: 24px;
  background: var(--color-white);
  box-shadow: 0 16px 40px rgb(40 25 47 / 10%);
`;

const Hero = styled.header`
  padding: clamp(28px, 6vw, 64px);
  background: linear-gradient(135deg, var(--color-orchid-subtle), var(--color-orchid));
`;

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

const Body = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);
  gap: clamp(32px, 6vw, 72px);
  padding: clamp(28px, 6vw, 64px);

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

const Description = styled(Paragraph)`
  margin-top: var(--spacing-20);
  white-space: pre-line;
`;

const AdditionalInfo = styled.ul`
  margin: var(--spacing-20) 0 0;
  padding-left: 20px;
  color: var(--color-midnight);
`;

const Details = styled.aside`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-20);
`;

const Detail = styled.div`
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: var(--spacing-12);
  align-items: start;
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
                  <span>{formatEventDate(event, i18n.language)}</span>
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
