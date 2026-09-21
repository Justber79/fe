"use client";

import { Button } from "@/components/core/button";
import { PageLayout } from "@/components/Layout";
import { Body, Description, Detail, Details, EventCard, Hero, PageContent } from "@/components/styled/eventPageLayout";
import { Heading1, Heading2, Paragraph } from "@/components/styled/text";
import { useEvents } from "@/hooks/useEvents";
import { eventDateRange } from "@/utils/calendar";
import { getHttpUrl, getUpcomingEvents } from "@/utils/events";
import { ArrowLeftIcon, ArrowRightIcon, CalendarBlankIcon, MapPinIcon } from "@phosphor-icons/react";
import { ApiEventN4DGetList, EventN4DType } from "need4deed-sdk";
import Link from "next/link";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const EventType = styled.span`
  display: inline-flex;
  align-self: flex-start;
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

const PageHeader = styled.header`
  min-width: 0;
  max-width: 720px;
  margin-bottom: clamp(28px, 5vw, 48px);
`;

const Eyebrow = styled.span`
  display: block;
  margin-bottom: var(--spacing-8);
  color: var(--color-orchid-dark, var(--color-orchid));
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const EventStack = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: clamp(32px, 6vw, 56px);
`;

const MoreEvents = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--spacing-20);
`;

const UpcomingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--spacing-20);
`;

const UpcomingCard = styled.article`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--spacing-16);
  padding: clamp(20px, 4vw, 28px);
  border: 1px solid var(--color-orchid-light, var(--color-orchid));
  border-radius: 20px;
  background: var(--color-white);
  box-shadow: 0 10px 28px rgb(40 25 47 / 8%);

  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 16px;
  }
`;

const UpcomingMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  color: var(--color-grey-500);
`;

const MetaRow = styled.span`
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  min-width: 0;
  gap: var(--spacing-8);
  align-items: start;

  > span {
    min-width: 0;
    overflow-wrap: anywhere;
  }
`;

const DetailsLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-8);
  max-width: 100%;
  width: fit-content;
  margin-top: auto;
  color: var(--color-midnight);
  font-weight: var(--font-weight-semibold);
  text-decoration: underline;
  text-underline-offset: 4px;
`;

const ResponsiveHeading1 = styled(Heading1)`
  overflow-wrap: anywhere;

  @media (max-width: 480px) {
    font-size: clamp(2rem, 11vw, 2.75rem);
    line-height: 1.08;
  }
`;

const ResponsiveHeading2 = styled(Heading2)`
  overflow-wrap: anywhere;
`;

const BackLink = styled(DetailsLink)`
  margin-bottom: var(--spacing-24);
`;

interface EventPageProps {
  eventId?: number;
}

function EventDetails({ event }: { event: ApiEventN4DGetList }) {
  const { t, i18n } = useTranslation();
  const registrationUrl = getHttpUrl(event?.linkRSVP);
  const eventTypeLabel =
    event?.type === EventN4DType.PARTY
      ? t("dashboard.calendar.createForm.typeParty")
      : t("dashboard.calendar.createForm.typeWorkshop");

  return (
    <EventCard>
      <Hero>
        <EventType>{eventTypeLabel}</EventType>
        <ResponsiveHeading1 margin={0}>{event.title}</ResponsiveHeading1>
        {event.subTitle && <Subtitle fontSize="var(--font-size-lg)">{event.subTitle}</Subtitle>}
      </Hero>

      <Body>
        <section>
          <Heading2>{t("eventPage.about")}</Heading2>
          <Description>{event.description}</Description>
          {event.additionalInfo?.length ? (
            <>
              {event.additionalTitle && <Heading2 margin="var(--spacing-32) 0 0">{event.additionalTitle}</Heading2>}
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
  );
}

export function EventPage({ eventId }: EventPageProps) {
  const { t, i18n } = useTranslation();
  const { data: events, isError, isLoading } = useEvents();
  const upcomingEvents = useMemo(() => getUpcomingEvents(events), [events]);
  const selectedEvent = eventId ? upcomingEvents.find((event) => event.id === eventId) : upcomingEvents[0];
  const additionalEvents = eventId ? [] : upcomingEvents.slice(1);

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
        ) : selectedEvent ? (
          <EventStack>
            {eventId ? (
              <BackLink href={`/${i18n.language}/event-page`}>
                <ArrowLeftIcon size={18} aria-hidden />
                {t("eventPage.backToEvents")}
              </BackLink>
            ) : (
              <PageHeader>
                <Eyebrow>{t("eventPage.eyebrow")}</Eyebrow>
                <ResponsiveHeading1 margin={0}>{t("eventPage.heading")}</ResponsiveHeading1>
                <Paragraph margin="var(--spacing-12) 0 0">{t("eventPage.intro")}</Paragraph>
              </PageHeader>
            )}

            <EventDetails event={selectedEvent} />

            {additionalEvents.length > 0 && (
              <MoreEvents>
                <ResponsiveHeading2 margin={0}>{t("eventPage.moreEvents")}</ResponsiveHeading2>
                <UpcomingGrid>
                  {additionalEvents.map((event) => (
                    <UpcomingCard key={event.id}>
                      <EventType>
                        {event.type === EventN4DType.PARTY
                          ? t("dashboard.calendar.createForm.typeParty")
                          : t("dashboard.calendar.createForm.typeWorkshop")}
                      </EventType>
                      <ResponsiveHeading2 margin={0}>{event.title}</ResponsiveHeading2>
                      <Paragraph margin={0}>{event.shortDescription}</Paragraph>
                      <UpcomingMeta>
                        <MetaRow>
                          <CalendarBlankIcon size={20} aria-hidden />
                          <span>
                            {eventDateRange(event, i18n.language, "Europe/Berlin")} {t("eventPage.berlinTime")}
                          </span>
                        </MetaRow>
                        <MetaRow>
                          <MapPinIcon size={20} aria-hidden />
                          <span>{event.address}</span>
                        </MetaRow>
                      </UpcomingMeta>
                      <DetailsLink href={`/${i18n.language}/event-page/${event.id}`}>
                        {t("eventPage.viewDetails")}
                        <ArrowRightIcon size={18} aria-hidden />
                      </DetailsLink>
                    </UpcomingCard>
                  ))}
                </UpcomingGrid>
              </MoreEvents>
            )}
          </EventStack>
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
