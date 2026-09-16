"use client";

import { Button } from "@/components/core/button";
import { PageLayout } from "@/components/Layout";
import { Body, Description, Detail, Details, EventCard, Hero, PageContent } from "@/components/styled/eventPageLayout";
import { Heading1, Heading2 } from "@/components/styled/text";
import { CalendarBlankIcon, MapPinIcon, TicketIcon } from "@phosphor-icons/react";
import { Lang } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

// Static one-off event page migrated from the website repo's
// www.need4deed.org/event-page (fe#1022) — this event isn't part of the
// backend-driven events system that the sibling `EventPage` component reads
// from, so its content stays hardcoded here rather than fetched, matching
// how it worked on the website. Named distinctly from `EventPage` to avoid
// confusion with that unrelated, API-driven page.
const REGISTRATION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfsr2Nppw6YGSkyFL54LRk44jv1jGtS2Q5uIPLCBTINJ1g2EA/viewform?usp=dialog";

const CommunityTagline = styled.div`
  margin-top: var(--spacing-32);
  padding: 0 clamp(28px, 6vw, 64px) clamp(28px, 6vw, 64px);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-8) var(--spacing-16);
  color: var(--color-grey-500);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-20);
`;

const LtrTag = styled.span`
  direction: ltr;
  unicode-bidi: embed;
`;

const RtlTag = styled.span`
  direction: rtl;
  unicode-bidi: embed;
`;

export function EventPageOne() {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === Lang.DE;

  return (
    <PageLayout>
      <PageContent>
        <EventCard>
          <Hero>
            <Heading1 margin={0}>{isGerman ? "Lasst uns machen" : "Let's make it happen"}</Heading1>
          </Hero>

          <Body>
            <section>
              <Heading2>{t("eventPage.about")}</Heading2>
              <Description>
                {isGerman ? (
                  <>
                    Ob letztes Jahr angekommen oder vor zwanzig Jahren &ndash; viele Menschen mit Migrationsgeschichte
                    wollen etwas beitragen. Aus diesem Willen wird aber nicht von selbst Ehrenamt: Das deutsche
                    Engagement-System ist oft zu starr, um so viel Energie aufzunehmen. Kann migrantisches Engagement
                    helfen, Rassismus zu bekämpfen? Vielleicht, aber zuerst muss es ihn selbst überleben.
                    {"\n"}Wir laden im Rahmen der Initiative „Ehrenamt interkulturell&ldquo; am 10. November 2026 ins
                    Refugio Berlin ein. Ein Abend über die Zukunft (post)migrantischen Engagements: Wie wird aus
                    Bereitschaft konkrete Tat, und wie flexibel muss das Ehrenamt dafür werden? Mit Impuls aus der
                    Wissenschaft, Podium aus Politik und Zivilgesellschaft &ndash; mit Teilnahme von Senatorin Cansel
                    Kiziltepe (Senatsverwaltung für Arbeit, Soziales, Gleichstellung, Integration, Vielfalt und
                    Antidiskriminierung) und Aydan Özoğuz, ehemalige Beauftragte der Bundesregierung für Migration,
                    Flüchtlinge und Integration und Vizepräsidentin des Deutschen Bundestages &ndash; und anschließendem
                    Netzwerken.
                  </>
                ) : (
                  <>
                    Whether you arrived last year or twenty years ago, many people with a migration history want to
                    contribute. But that willingness doesn&apos;t turn into volunteering on its own: Germany&apos;s
                    civic engagement system is often too rigid to absorb that much energy. Can migrant engagement help
                    fight racism? Maybe, but first it has to survive it.
                    {"\n"}As part of the &quot;Ehrenamt interkulturell&quot; (Volunteering Interculturally) initiative,
                    we invite you to Refugio Berlin on November 10, 2026. An evening about the future of (post-)migrant
                    engagement: how does willingness turn into concrete action, and how flexible does volunteering need
                    to become for that? With input from academia, a panel from politics and civil society &ndash; with
                    Senator Cansel Kiziltepe (Senate Department for Labour, Social Affairs, Equality, Integration,
                    Diversity and Anti-Discrimination) and Aydan Özoğuz, former Federal Government Commissioner for
                    Migration, Refugees and Integration and Vice President of the German Bundestag &ndash; and
                    networking afterward.
                  </>
                )}
              </Description>
            </section>

            <Details aria-label={t("eventPage.details")}>
              <Detail>
                <CalendarBlankIcon size={22} aria-hidden />
                <span>{isGerman ? "10. November 2026 — 17:30–20:30 Uhr" : "November 10, 2026 — 5:30–8:30 PM"}</span>
              </Detail>
              <Detail>
                <MapPinIcon size={22} aria-hidden />
                <span>Refugio Berlin</span>
              </Detail>
              <Detail>
                <TicketIcon size={22} aria-hidden />
                <span>
                  {isGerman
                    ? "Eintritt frei mit Anmeldung, auf Deutsch"
                    : "Free entry with registration, held in German"}
                </span>
              </Detail>
              <Button
                text={t("eventPage.register")}
                width="100%"
                onClick={() => window.open(REGISTRATION_URL, "_blank", "noopener,noreferrer")}
              />
            </Details>
          </Body>

          <CommunityTagline>
            <LtrTag>Підтримуємо всі спільноти!</LtrTag>
            <LtrTag>Поддерживаем все сообщества!</LtrTag>
            <RtlTag>حمایت از همه جوامع!</RtlTag>
            <RtlTag>ندعم جميع المجتمعات!</RtlTag>
          </CommunityTagline>
        </EventCard>
      </PageContent>
    </PageLayout>
  );
}

export default EventPageOne;
