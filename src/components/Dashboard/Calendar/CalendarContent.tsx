"use client";
import { CaretLeftIcon, CaretRightIcon, HandHeartIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import Button from "@/components/core/button/Button/Button";

function buildCalendarCells(year: number, month: number): { day: number; currentMonth: boolean }[] {
  const rawDow = new Date(year, month, 1).getDay(); // 0=Sunday
  const firstDow = (rawDow + 6) % 7; // Monday=0, ..., Sunday=6
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { day: number; currentMonth: boolean }[] = [];

  for (let i = firstDow - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, currentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true });
  }
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, currentMonth: false });
    }
  }

  return cells;
}

function getDayLabels(locale: string): string[] {
  const labels: string[] = [];
  // Jan 1 2024 was a Monday — iterate Mon→Sun
  for (let i = 0; i < 7; i++) {
    const d = new Date(2024, 0, 1 + i);
    labels.push(d.toLocaleString(locale, { weekday: "narrow" }));
  }
  return labels;
}

export function CalendarContent() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const today = new Date();
  const [displayDate, setDisplayDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const monthLabel = displayDate.toLocaleString(i18n.language, { month: "long", year: "numeric" });
  const dayLabels = getDayLabels(i18n.language);
  const cells = buildCalendarCells(year, month);

  const prevMonth = () => {
    setSelectedDay(null);
    setDisplayDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setSelectedDay(null);
    setDisplayDate(new Date(year, month + 1, 1));
  };

  const isToday = (day: number, currentMonth: boolean) =>
    currentMonth && day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const handleDayClick = (day: number, currentMonth: boolean) => {
    if (!currentMonth) return;
    setSelectedDay(day === selectedDay ? null : day);
  };

  const handleCreateEvent = () => {
    const params = new URLSearchParams();
    if (selectedDay !== null) {
      const date = new Date(year, month, selectedDay);
      params.set("date", date.toISOString().split("T")[0]);
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    router.push(`/${i18n.language}/dashboard/calendar/create${query}`);
  };

  return (
    <PageWrapper>
      <TopRow>
        <HandHeartIcon size={32} color="var(--color-salmon)" />
        <Button
          text={t("dashboard.calendar.createEvent")}
          onClick={handleCreateEvent}
          width="auto"
          padding="var(--button-padding)"
        />
      </TopRow>

      <CalendarCenter>
        <CalendarBox>
          <CalendarHeader>
            <NavButton onClick={prevMonth} aria-label="previous month">
              <CaretLeftIcon size={20} color="var(--color-midnight)" />
            </NavButton>
            <MonthLabel>{monthLabel}</MonthLabel>
            <NavButton onClick={nextMonth} aria-label="next month">
              <CaretRightIcon size={20} color="var(--color-midnight)" />
            </NavButton>
          </CalendarHeader>

          <DaysGrid>
            {dayLabels.map((label, i) => (
              <DayHeader key={i}>{label}</DayHeader>
            ))}

            {cells.map((cell, i) => (
              <DayCell
                key={i}
                $isToday={isToday(cell.day, cell.currentMonth)}
                $isSelected={cell.currentMonth && cell.day === selectedDay}
                $faded={!cell.currentMonth}
                $clickable={cell.currentMonth}
                onClick={() => handleDayClick(cell.day, cell.currentMonth)}
              >
                {cell.day}
              </DayCell>
            ))}
          </DaysGrid>
        </CalendarBox>
      </CalendarCenter>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
  padding: var(--spacing-32) var(--spacing-48) var(--spacing-48);
  width: 100%;
  box-sizing: border-box;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-white);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-16) var(--spacing-24);
  width: 100%;
  box-sizing: border-box;
`;

const CalendarCenter = styled.div`
  display: flex;
  justify-content: center;
`;

const CalendarBox = styled.div`
  border: var(--border-width-medium) solid var(--color-midnight);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-24);
  background: var(--color-white);
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-16);
`;

const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: var(--spacing-8);
  border-radius: 50%;

  &:hover {
    background: var(--color-orchid-subtle);
  }
`;

const MonthLabel = styled.span`
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--color-midnight);
  text-transform: capitalize;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-4);
`;

const DayHeader = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: var(--font-size-xs);
  color: var(--color-midnight);
  padding: var(--spacing-8) 0;
`;

interface DayCellProps {
  $isToday: boolean;
  $isSelected: boolean;
  $faded: boolean;
  $clickable: boolean;
}

const DayCell = styled.div<DayCellProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--spacing-40);
  height: var(--spacing-40);
  margin: auto;
  border-radius: 50%;
  font-size: var(--font-size-xs);
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  color: ${({ $isToday, $isSelected, $faded }) => {
    if ($isToday || $isSelected) return "var(--color-white)";
    if ($faded) return "var(--color-grey-300)";
    return "var(--color-midnight)";
  }};
  background: ${({ $isToday, $isSelected }) => {
    if ($isToday) return "var(--color-midnight)";
    if ($isSelected) return "var(--color-aubergine)";
    return "transparent";
  }};
  font-weight: ${({ $isToday, $isSelected }) => ($isToday || $isSelected ? "bold" : "normal")};

  &:hover {
    background: ${({ $clickable, $isToday, $isSelected }) =>
      $clickable && !$isToday && !$isSelected ? "var(--color-orchid-subtle)" : undefined};
  }
`;
