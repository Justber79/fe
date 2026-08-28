import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import type { ApiEventN4DGetList } from "need4deed-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { calendarCells, dateKey, eventDateKeys } from "@/utils/calendar";

interface Props {
  events: ApiEventN4DGetList[];
  monthDate: Date;
  selectedDateKey: string | null;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onDateClick: (date: Date, hasEvents: boolean) => void;
}

export function CalendarGrid(props: Props) {
  const { events, monthDate, selectedDateKey, onPreviousMonth, onNextMonth, onDateClick } = props;
  const { t, i18n } = useTranslation();
  const today = useMemo(() => new Date(), []);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const eventCounts = events.reduce<Record<string, number>>((counts, event) => {
    eventDateKeys(event).forEach((key) => {
      counts[key] = (counts[key] ?? 0) + 1;
    });
    return counts;
  }, {});

  return (
    <CalendarBox>
      <CalendarHeader>
        <Nav type="button" onClick={onPreviousMonth} aria-label={t("dashboard.calendar.previousMonth")}>
          <CaretLeftIcon />
        </Nav>
        <strong>{monthDate.toLocaleString(i18n.language, { month: "long", year: "numeric" })}</strong>
        <Nav type="button" onClick={onNextMonth} aria-label={t("dashboard.calendar.nextMonth")}>
          <CaretRightIcon />
        </Nav>
      </CalendarHeader>
      <Days>
        {Array.from({ length: 7 }, (_, index) => (
          <DayName key={index}>
            {new Date(2024, 0, 1 + index).toLocaleString(i18n.language, { weekday: "narrow" })}
          </DayName>
        ))}
        {calendarCells(year, month).map((cell, index) => {
          const date = new Date(year, month, cell.day);
          const key = dateKey(date);
          const eventCount = cell.current ? (eventCounts[key] ?? 0) : 0;
          const label = date.toLocaleDateString(i18n.language, { dateStyle: "full" });
          return (
            <Day
              key={index}
              type="button"
              disabled={!cell.current}
              $faded={!cell.current}
              $today={cell.current && key === dateKey(today)}
              $selected={cell.current && key === selectedDateKey}
              $hasEvents={eventCount > 0}
              onClick={() => onDateClick(date, eventCount > 0)}
              aria-label={`${label}${eventCount ? `, ${eventCount} ${t("dashboard.calendar.events")}` : ""}`}
              aria-pressed={cell.current ? key === selectedDateKey : undefined}
            >
              {cell.day}
              {eventCount > 0 && <Count aria-hidden="true">{eventCount}</Count>}
            </Day>
          );
        })}
      </Days>
    </CalendarBox>
  );
}

const CalendarBox = styled.div`
  padding: var(--spacing-20);
  border: var(--border-width-thin) solid var(--color-orchid);
  border-radius: var(--border-radius-large);
  background: var(--color-white);
  box-sizing: border-box;
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
  color: var(--color-midnight);
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
const Day = styled.button<{ $faded: boolean; $today: boolean; $selected: boolean; $hasEvents: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border: ${({ $today, $selected }) =>
    $selected
      ? "var(--border-width-medium) solid var(--color-aubergine)"
      : $today
        ? "var(--border-width-medium) solid var(--color-salmon)"
        : "var(--border-width-medium) solid transparent"};
  border-radius: 50%;
  background: ${({ $selected, $hasEvents }) =>
    $selected ? "var(--color-aubergine)" : $hasEvents ? "var(--color-orchid-subtle)" : "transparent"};
  color: ${({ $faded, $selected }) =>
    $faded ? "var(--color-grey-300)" : $selected ? "var(--color-white)" : "var(--color-midnight)"};
  cursor: ${({ $faded }) => ($faded ? "default" : "pointer")};
  font-weight: ${({ $today, $selected, $hasEvents }) => ($today || $selected || $hasEvents ? "bold" : "normal")};
  &:hover:not(:disabled) {
    background: ${({ $selected }) => ($selected ? "var(--color-aubergine)" : "var(--color-orchid)")};
  }
`;
const Count = styled.span`
  position: absolute;
  right: 1px;
  bottom: 1px;
  display: grid;
  place-items: center;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  border-radius: 999px;
  background: var(--color-salmon);
  color: var(--color-midnight);
  font-size: 10px;
  box-sizing: border-box;
`;
