"use client";

import { Button } from "@/components/core/button";
import { ImageWithGradient } from "@/components/core/image";
import { FullWidthContainer, OverlayingSectionContainer } from "@/components/styled/container";
import { CustomHeading, Heading1, Heading4 } from "@/components/styled/text";
import { eventsPublicLandingUrl, ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";
import { useEvents } from "@/hooks/useEvents";
import { getImageUrl } from "@/utils/helpers";
import { EventN4DType } from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { formatEventDate, getUpcomingEvent } from "@/utils/events";

const EventsSectionContainer = styled(OverlayingSectionContainer)`
  height: var(--homepage-events-section-container-height);
  justify-content: center;
  align-items: center;
  gap: var(--homepage-events-section-content-container-gap);
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--homepage-events-section-content-container-gap);
`;

const EventContainer = styled.div`
  display: flex;
  flex-direction: var(--homepage-events-section-event-container-flex-direction);
  gap: var(--homepage-events-section-event-container-gap);
`;

const EventCard = styled.div`
  display: flex;
  flex-direction: column;
  width: var(--homepage-events-section-event-card-width, 100%);
  gap: var(--homepage-events-section-event-card-gap);
`;

const EventHeadline = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  gap: var(--homepage-events-section-event-card-headline-gap);
`;

const EventTitleTag = styled.div`
  padding: var(--homepage-events-section-event-card-event-title-tag-padding);
  border-radius: var(--homepage-events-section-event-card-event-title-tag-border-radius);
  background-color: var(--color-orchid);
`;

const EventDescription = styled(Heading4)`
  white-space: pre-line;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: var(--homepage-events-section-button-container-justify-content);
`;

const imageNamesMap: Record<EventN4DType, Record<ScreenTypes, string>> = {
  [EventN4DType.PARTY]: {
    mobile: "events1-bg-mobile.webp",
    tablet: "events1-bg-tablet.webp",
    desktop: "events1-bg-desktop.webp",
  },
  [EventN4DType.WORKSHOP]: {
    mobile: "events2-bg-mobile.webp",
    tablet: "events2-bg-tablet.webp",
    desktop: "events2-bg-desktop.webp",
  },
};

export function EventsSection() {
  const { t, i18n } = useTranslation();
  const screenType = useScreenType();
  const { data: events, isLoading } = useEvents();
  const upcomingEvent = useMemo(() => getUpcomingEvent(events), [events]);
  const eventType = upcomingEvent?.type ?? EventN4DType.PARTY;
  const imageUrl = getImageUrl(imageNamesMap[eventType][screenType]);

  return (
    <FullWidthContainer id="Events-Section-FWContainer">
      <ImageWithGradient
        imageUrl={imageUrl}
        gradientClass="image-filter-gradient-blue"
        height="var(--homepage-events-section-container-height)"
      />

      <EventsSectionContainer id="events-section-container">
        <ContentContainer>
          <Heading1 color="var(--color-white)" margin={0}>
            {t("homepage.events.headline")}
          </Heading1>

          <EventContainer>
            <EventCard aria-live="polite">
              {isLoading ? (
                <Heading4 color="var(--color-white)" margin={0}>
                  {t("homepage.events.loading")}
                </Heading4>
              ) : upcomingEvent ? (
                <>
                  <EventHeadline>
                    <EventTitleTag>
                      <CustomHeading
                        as="h2"
                        fontWeight={700}
                        fontSize="24px"
                        lineheight="24px"
                        color="var(--color-midnight)"
                        margin={0}
                      >
                        {upcomingEvent.title}
                      </CustomHeading>
                    </EventTitleTag>
                    <Heading4 color="var(--color-white)" margin={0}>
                      {formatEventDate(upcomingEvent, i18n.language)}
                    </Heading4>
                  </EventHeadline>
                  <EventDescription color="var(--color-white)" margin={0}>
                    {upcomingEvent.shortDescription}
                  </EventDescription>
                </>
              ) : (
                <Heading4 color="var(--color-white)" margin={0}>
                  {t("homepage.events.empty")}
                </Heading4>
              )}
            </EventCard>

            {upcomingEvent && (
              <ButtonContainer>
                <Button
                  text={t("homepage.events.button")}
                  onClick={() => window.location.assign(`/${i18n.language}${eventsPublicLandingUrl}`)}
                />
              </ButtonContainer>
            )}
          </EventContainer>
        </ContentContainer>
      </EventsSectionContainer>
    </FullWidthContainer>
  );
}

export default EventsSection;
