"use client";
import {
  CalendarBlankIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  LinkIcon,
  MapPinIcon,
} from "@phosphor-icons/react";
import type { ApiEventN4DGetList } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import Button from "@/components/core/button/Button/Button";
import { ConfirmationDialog } from "@/components/Dashboard/Profile/sections/shared/ConfirmationDialog";
import { Heading2, Heading3, Paragraph } from "@/components/styled/text";
import { useDeleteEvent, useEvents } from "@/hooks";

function cells(year: number, month: number) {
  const first = (new Date(year, month, 1).getDay() + 6) % 7;
  const previous = new Date(year, month, 0).getDate();
  const count = new Date(year, month + 1, 0).getDate();
  const result: { day: number; current: boolean }[] = [];
  for (let index = first - 1; index >= 0; index--) result.push({ day: previous - index, current: false });
  for (let day = 1; day <= count; day++) result.push({ day, current: true });
  for (let day = 1; result.length < 42; day++) result.push({ day, current: false });
  return result;
}

function key(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function range(event: ApiEventN4DGetList, locale: string) {
  const start = new Date(event.date);
  const end = event.dateEnd ? new Date(event.dateEnd) : undefined;
  const date = start.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const time = start.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  const endTime = end?.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}${endTime ? `–${endTime}` : ""}`;
}

export function CalendarContent() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [monthDate, setMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [showPast, setShowPast] = useState(false);
  const [deleting, setDeleting] = useState<ApiEventN4DGetList | null>(null);
  const { data: events = [], isLoading, isError } = useEvents();
  const remove = useDeleteEvent();
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const upcoming = events.filter((event) => new Date(event.dateEnd ?? event.date) >= today);
  const past = events.filter((event) => new Date(event.dateEnd ?? event.date) < today).reverse();
  const eventDays = new Set(events.map((event) => key(new Date(event.date))));
  const create = (date?: string) =>
    router.push(`/${i18n.language}/dashboard/calendar/create${date ? `?date=${date}` : ""}`);

  const clickDay = (day: number) => {
    const selected = new Date(year, month, day);
    const event = events.find((item) => key(new Date(item.date)) === key(selected));
    if (event) document.getElementById(`event-${event.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    else create(key(selected));
  };

  return (
    <Page>
      <PageHeading>
        <Heading2>{t("dashboard.calendar.events")}</Heading2>
        <Button
          text={t("dashboard.calendar.createEvent")}
          onClick={() => create()}
          width="auto"
          padding="var(--button-padding)"
        />
      </PageHeading>
      <Grid>
        <Events>
          <SectionHeading>
            <Heading3>{t("dashboard.calendar.upcomingEvents")}</Heading3>
          </SectionHeading>
          {isLoading && <State>{t("dashboard.calendar.loading")}</State>}
          {isError && <State>{t("dashboard.calendar.loadError")}</State>}
          {!isLoading && !isError && !upcoming.length && (
            <State>
              <Heading3>{t("dashboard.calendar.emptyTitle")}</Heading3>
              <Paragraph>{t("dashboard.calendar.emptyText")}</Paragraph>
            </State>
          )}
          {upcoming.map((event) => (
            <EventCard
              event={event}
              locale={i18n.language}
              key={event.id}
              onEdit={() => router.push(`/${i18n.language}/dashboard/calendar/${event.id}/edit`)}
              onDelete={() => setDeleting(event)}
              t={t}
            />
          ))}
          <Past>
            <PastToggle type="button" onClick={() => setShowPast((value) => !value)} aria-expanded={showPast}>
              <span>
                <strong>{t("dashboard.calendar.pastEvents")}</strong>
              </span>
              <CaretDownIcon size={20} />
            </PastToggle>
            {showPast &&
              (past.length ? (
                past.map((event) => (
                  <PastRow key={event.id}>
                    <span>{event.title}</span>
                    <time>{new Date(event.date).toLocaleDateString(i18n.language)}</time>
                    <button
                      type="button"
                      onClick={() => router.push(`/${i18n.language}/dashboard/calendar/${event.id}/edit`)}
                    >
                      {t("dashboard.calendar.editEvent")}
                    </button>
                  </PastRow>
                ))
              ) : (
                <Paragraph>{t("dashboard.calendar.noPastEvents")}</Paragraph>
              ))}
          </Past>
        </Events>
        <aside>
          <SectionHeading>
            <div>
              <Heading2>{t("dashboard.calendar.calendarTitle")}</Heading2>
              <Paragraph>{t("dashboard.calendar.calendarHelp")}</Paragraph>
            </div>
          </SectionHeading>
          <CalendarBox>
            <CalendarHeader>
              <Nav
                onClick={() => setMonthDate(new Date(year, month - 1, 1))}
                aria-label={t("dashboard.calendar.previousMonth")}
              >
                <CaretLeftIcon />
              </Nav>
              <strong>{monthDate.toLocaleString(i18n.language, { month: "long", year: "numeric" })}</strong>
              <Nav
                onClick={() => setMonthDate(new Date(year, month + 1, 1))}
                aria-label={t("dashboard.calendar.nextMonth")}
              >
                <CaretRightIcon />
              </Nav>
            </CalendarHeader>
            <Days>
              {Array.from({ length: 7 }, (_, index) => (
                <DayName key={index}>
                  {new Date(2024, 0, 1 + index).toLocaleString(i18n.language, { weekday: "narrow" })}
                </DayName>
              ))}
              {cells(year, month).map((cell, index) => {
                const date = new Date(year, month, cell.day);
                const hasEvent = cell.current && eventDays.has(key(date));
                return (
                  <Day
                    key={index}
                    type="button"
                    disabled={!cell.current}
                    $faded={!cell.current}
                    $today={cell.current && key(date) === key(today)}
                    $event={hasEvent}
                    onClick={() => clickDay(cell.day)}
                  >
                    {cell.day}
                    {hasEvent && <Dot />}
                  </Day>
                );
              })}
            </Days>
          </CalendarBox>
        </aside>
      </Grid>
      {deleting && (
        <ConfirmationDialog
          title={t("dashboard.calendar.deleteConfirmTitle")}
          message={t("dashboard.calendar.deleteConfirmText", { title: deleting.title })}
          confirmText={t("dashboard.calendar.deleteEvent")}
          cancelText={t("dashboard.calendar.createForm.cancel")}
          compact
          onCancel={() => setDeleting(null)}
          onConfirm={() => remove.mutate(deleting.id, { onSettled: () => setDeleting(null) })}
        />
      )}
    </Page>
  );
}

interface EventCardProps {
  event: ApiEventN4DGetList;
  locale: string;
  onEdit: () => void;
  onDelete: () => void;
  t: ReturnType<typeof useTranslation>["t"];
}
function EventCard({ event, locale, onEdit, onDelete, t }: EventCardProps) {
  const date = new Date(event.date);
  return (
    <Card id={`event-${event.id}`}>
      <DateBox>
        <span>{date.toLocaleString(locale, { month: "short" })}</span>
        <strong>{date.getDate()}</strong>
      </DateBox>
      <Details>
        <CardHeader>
          <div>
            <Heading3>{event.title}</Heading3>
            {event.shortDescription && <Description>{event.shortDescription}</Description>}
          </div>
          <Status $active={event.active}>
            {t(event.active ? "dashboard.calendar.published" : "dashboard.calendar.draft")}
          </Status>
        </CardHeader>
        <Meta>
          <CalendarBlankIcon size={20} />
          {range(event, locale)}
        </Meta>
        <Meta>
          <MapPinIcon size={20} />
          {event.address}
        </Meta>
        <Meta>
          <LinkIcon size={20} />
          <Registration href={event.linkRSVP} target="_blank" rel="noopener noreferrer">
            {t("dashboard.calendar.openRegistration")}
          </Registration>
        </Meta>
        <Actions>
          <Button
            text={t("dashboard.calendar.editEvent")}
            onClick={onEdit}
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
            onClick={onDelete}
            height="40px"
            width="auto"
            textFontSize="var(--font-size-sm)"
            padding="var(--spacing-8) var(--spacing-16)"
          />
        </Actions>
      </Details>
    </Card>
  );
}

const Page = styled.div`
  padding: var(--spacing-32) var(--spacing-48) var(--spacing-48);
  width: 100%;
  box-sizing: border-box;
  color: var(--color-midnight);
`;
const PageHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-24);
  margin-bottom: var(--spacing-32);
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
  gap: var(--spacing-24);
  align-items: start;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;
const Events = styled.section`
  min-width: 0;
`;
const SectionHeading = styled.div`
  min-height: 64px;
  margin-bottom: var(--spacing-16);
  p {
    margin: var(--spacing-4) 0 0;
    color: var(--color-midnight);
  }
`;
const State = styled.div`
  padding: var(--spacing-32);
  border-radius: var(--border-radius-large);
  background: var(--color-white);
  text-align: center;
`;
const Card = styled.article`
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: var(--spacing-20);
  padding: var(--spacing-24);
  margin-bottom: var(--spacing-16);
  border: var(--border-width-thin) solid var(--color-orchid);
  border-radius: var(--border-radius-large);
  background: var(--color-white);
  box-sizing: border-box;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;
const DateBox = styled.div`
  width: 64px;
  height: 76px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-medium);
  background: var(--color-orchid-subtle);
  span {
    text-transform: uppercase;
    font-size: var(--font-size-xs);
    font-weight: bold;
  }
  strong {
    font-size: var(--font-size-xl);
  }
`;
const Details = styled.div`
  min-width: 0;
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-16);
`;
const Description = styled.p`
  color: var(--color-midnight);
  line-height: 1.5;
  margin: var(--spacing-8) 0 var(--spacing-16);
`;
const Status = styled.span<{ $active: boolean }>`
  height: max-content;
  padding: var(--spacing-4) var(--spacing-8);
  border-radius: var(--border-radius-small);
  font-size: var(--font-size-xs);
  font-weight: bold;
  color: ${({ $active }) => ($active ? "var(--color-green-700)" : "var(--color-grey-500)")};
  background: var(--color-orchid-subtle);
`;
const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  margin-top: var(--spacing-8);
  color: var(--color-midnight);
`;
const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-16);
  flex-wrap: wrap;
  margin-top: var(--spacing-20);
  padding-top: var(--spacing-16);
  border-top: var(--border-width-thin) solid var(--color-grey-200);
`;
const Registration = styled.a`
  color: var(--color-midnight);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
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
  text-align: left;
  span {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
  }
  strong {
    font-size: var(--text-h3-font-size);
    line-height: var(--text-h3-line-height);
    font-weight: var(--text-h3-font-weight);
    letter-spacing: var(--text-h3-letter-spacing);
  }
`;
const PastRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: var(--spacing-16);
  padding: var(--spacing-12) 0;
  border-bottom: var(--border-width-thin) solid var(--color-grey-200);
  button {
    border: 0;
    background: transparent;
    color: var(--color-aubergine);
    cursor: pointer;
    font-weight: bold;
  }
`;
const CalendarBox = styled.div`
  padding: var(--spacing-20);
  box-sizing: border-box;
  border: var(--border-width-thin) solid var(--color-orchid);
  border-radius: var(--border-radius-large);
  background: var(--color-white);
`;
const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-16);
  strong {
    text-transform: capitalize;
  }
`;
const Nav = styled.button`
  display: flex;
  border: 0;
  border-radius: 50%;
  padding: var(--spacing-8);
  background: var(--color-orchid-subtle);
  cursor: pointer;
`;
const Days = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-4);
`;
const DayName = styled.div`
  padding: var(--spacing-8) 0;
  text-align: center;
  color: var(--color-midnight);
  font-size: var(--font-size-xs);
  font-weight: bold;
`;
const Day = styled.button<{ $faded: boolean; $today: boolean; $event: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border: ${({ $today }) => ($today ? "var(--border-width-medium) solid var(--color-salmon)" : "0")};
  border-radius: 50%;
  background: ${({ $event }) => ($event ? "var(--color-midnight)" : "transparent")};
  color: ${({ $faded, $event }) =>
    $faded ? "var(--color-grey-300)" : $event ? "var(--color-white)" : "var(--color-midnight)"};
  cursor: ${({ $faded }) => ($faded ? "default" : "pointer")};
  font-weight: ${({ $today, $event }) => ($today || $event ? "bold" : "normal")};
  &:hover:not(:disabled) {
    background: var(--color-orchid);
  }
`;
const Dot = styled.i`
  position: absolute;
  bottom: 3px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-salmon);
`;
