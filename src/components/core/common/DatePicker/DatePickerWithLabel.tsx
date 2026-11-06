import { format, isSameDay, isValid, parse, startOfDay } from "date-fns";
import { type Locale } from "date-fns/locale";
import { useEffect, useId, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useTranslation } from "react-i18next";

const MIN_YEAR = 2025;

import {
  DateError,
  DateInput,
  DateInputContainer,
  DateInputIcon,
  DateInputIconButton,
  DatePickerPopover,
  DatePickerWrapper,
  FloatingLabel,
} from "./styles";

type Props = {
  date: Date | undefined;
  onSelect: (d: Date | undefined) => void;
  locale?: Locale;
  allowFuture?: boolean;
  minDate?: Date;
  selectableDate?: Date | null;
  label?: string;
  showTodayIndicator?: boolean;
  todayText?: string;
  hasError?: boolean;
  minYear?: number;
};

export function DatePickerWithLabel({
  date,
  onSelect,
  locale,
  allowFuture = false,
  minDate,
  selectableDate,
  label,
  showTodayIndicator = false,
  todayText = "today",
  hasError,
  minYear = MIN_YEAR,
}: Props) {
  const { t } = useTranslation();
  const inputId = useId();
  const errorId = useId();
  const [inputError, setInputError] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [month, setMonth] = useState<Date>(date || new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.activeElement === inputRef.current) return;

    if (date) {
      const formatted = format(date, "dd.MM.yyyy");
      if (showTodayIndicator) {
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        setInputValue(isToday ? `${formatted} (${todayText})` : formatted);
      } else {
        setInputValue(formatted);
      }
    } else {
      setInputValue("");
    }
  }, [date, showTodayIndicator, todayText]);

  useEffect(() => {
    if (isOpen && date && isValid(date)) {
      setMonth(date);
    }
  }, [isOpen, date]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);

    let value = digits;
    if (digits.length > 4) {
      value = `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
    } else if (digits.length > 2) {
      value = `${digits.slice(0, 2)}.${digits.slice(2)}`;
    }

    setInputValue(value);

    const dateRegex = /^\d{1,2}\.\d{1,2}\.\d{4}$/;

    if (!dateRegex.test(value)) {
      setInputError(undefined);
      return;
    }

    const parsedDate = parse(value, "dd.MM.yyyy", new Date());

    if (!isValid(parsedDate)) {
      setInputError(t("datePicker.invalidDate"));
    } else if (parsedDate.getFullYear() < minYear) {
      setInputError(t("datePicker.beforeMinYear", { year: minYear }));
    } else {
      setInputError(undefined);
      onSelect(parsedDate);
    }
  };

  const handleInputBlur = () => {
    if (inputError) return;
    if (date) {
      const formatted = format(date, "dd.MM.yyyy");
      if (showTodayIndicator) {
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        setInputValue(isToday ? `${formatted} (${todayText})` : formatted);
      } else {
        setInputValue(formatted);
      }
    }
  };

  const earliest = startOfDay(minDate ?? new Date());
  const isBeforeEarliest = (day: Date) => day < earliest && !(selectableDate && isSameDay(day, selectableDate));

  const handleIconClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <DatePickerWrapper ref={containerRef} data-testid="date-picker-wrapper">
      <DateInputContainer $hasLabel={!!label}>
        {label && <FloatingLabel htmlFor={inputId}>{label}</FloatingLabel>}
        <DateInputIconButton
          type="button"
          onClick={handleIconClick}
          aria-label={label ? `${t("datePicker.openCalendar")}: ${label}` : t("datePicker.openCalendar")}
          aria-expanded={isOpen}
        >
          <DateInputIcon size={24} weight="regular" aria-hidden />
        </DateInputIconButton>
        <DateInput
          id={inputId}
          $hasError={hasError || !!inputError}
          aria-invalid={hasError || !!inputError}
          aria-describedby={inputError ? errorId : undefined}
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          data-testid="date-picker-input"
          placeholder="dd.mm.yyyy"
        />
      </DateInputContainer>
      {inputError && (
        <DateError id={errorId} role="alert">
          {inputError}
        </DateError>
      )}
      <DatePickerPopover $isOpen={isOpen}>
        <DayPicker
          mode="single"
          selected={date}
          onSelect={(d) => {
            setInputError(undefined);
            onSelect(d);
            setIsOpen(false);
          }}
          month={month}
          onMonthChange={setMonth}
          locale={locale}
          captionLayout="dropdown"
          startMonth={new Date(minYear, 0)}
          endMonth={new Date(new Date().getFullYear() + 10, 11)}
          disabled={allowFuture ? isBeforeEarliest : { after: new Date() }}
        />
      </DatePickerPopover>
    </DatePickerWrapper>
  );
}
