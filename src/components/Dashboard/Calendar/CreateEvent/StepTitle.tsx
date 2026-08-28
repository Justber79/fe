"use client";
import Button from "@/components/core/button/Button/Button";
import { Heading2, Heading3 } from "@/components/styled/text";
import { useClickOutside } from "@/hooks";
import { CaretDownIcon } from "@phosphor-icons/react";
import { EventN4DType } from "need4deed-sdk";
import { type KeyboardEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { EventFormData } from "./CreateEvent";
import {
  ButtonRow,
  CharCount,
  FieldGroup,
  FieldLabel,
  HelperText,
  SelectButton,
  SelectContainer,
  SelectOption,
  SelectOptions,
  StyledInput,
  StyledTextarea,
} from "./styles";

const TITLE_MAX = 128;
export const DESCRIPTION_MAX = 512;

interface Props {
  type: EventN4DType;
  title: string;
  description: string;
  onChange: (fields: Partial<EventFormData>) => void;
  onNext: () => void;
  onCancel: () => void;
  isNextEnabled: boolean;
}

export function StepTitle({ type, title, description, onChange, onNext, onCancel, isNextEnabled }: Props) {
  const { t } = useTranslation();
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [activeTypeIndex, setActiveTypeIndex] = useState(0);
  const typeSelectRef = useRef<HTMLDivElement>(null);
  const typeButtonRef = useRef<HTMLButtonElement>(null);
  const typeOptions = [
    { value: EventN4DType.WORKSHOP, label: t("dashboard.calendar.createForm.typeWorkshop") },
    { value: EventN4DType.PARTY, label: t("dashboard.calendar.createForm.typeParty") },
  ];
  const selectedType = typeOptions.find((option) => option.value === type) ?? typeOptions[0];

  useClickOutside(typeSelectRef, () => setIsTypeOpen(false));

  const openTypeSelect = () => {
    setActiveTypeIndex(
      Math.max(
        0,
        typeOptions.findIndex((option) => option.value === type),
      ),
    );
    setIsTypeOpen(true);
  };

  const selectType = (value: EventN4DType) => {
    onChange({ type: value });
    setIsTypeOpen(false);
    typeButtonRef.current?.focus();
  };

  const handleTypeKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      setIsTypeOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isTypeOpen) {
        openTypeSelect();
        return;
      }
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveTypeIndex((index) => (index + direction + typeOptions.length) % typeOptions.length);
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && isTypeOpen) {
      event.preventDefault();
      selectType(typeOptions[activeTypeIndex].value);
    }
  };

  return (
    <>
      <Heading2>{t("dashboard.calendar.createForm.eventTitle")}</Heading2>

      <FieldGroup>
        <FieldLabel htmlFor="event-type">{t("dashboard.calendar.createForm.typeLabel")}</FieldLabel>
        <SelectContainer ref={typeSelectRef}>
          <SelectButton
            ref={typeButtonRef}
            id="event-type"
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isTypeOpen}
            aria-controls="event-type-options"
            aria-activedescendant={isTypeOpen ? `event-type-option-${activeTypeIndex}` : undefined}
            onClick={() => (isTypeOpen ? setIsTypeOpen(false) : openTypeSelect())}
            onKeyDown={handleTypeKeyDown}
          >
            <span>{selectedType.label}</span>
            <CaretDownIcon aria-hidden="true" />
          </SelectButton>
          {isTypeOpen && (
            <SelectOptions id="event-type-options" role="listbox" aria-labelledby="event-type">
              {typeOptions.map((option, index) => (
                <SelectOption
                  id={`event-type-option-${index}`}
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === type}
                  $active={index === activeTypeIndex}
                  onMouseEnter={() => setActiveTypeIndex(index)}
                  onClick={() => selectType(option.value)}
                >
                  {option.label}
                </SelectOption>
              ))}
            </SelectOptions>
          )}
        </SelectContainer>
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="event-title">{t("dashboard.calendar.createForm.titleLabel")}</FieldLabel>
        <StyledInput
          id="event-title"
          value={title}
          maxLength={TITLE_MAX}
          placeholder={t("dashboard.calendar.createForm.titlePlaceholder")}
          aria-required="true"
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <HelperText>{t("dashboard.calendar.createForm.titleHelper")}</HelperText>
        <CharCount>
          {title.length}/{TITLE_MAX}
        </CharCount>
      </FieldGroup>

      <FieldGroup>
        <Heading3>{t("dashboard.calendar.createForm.descriptionLabel")}</Heading3>
        <StyledTextarea
          aria-required="true"
          value={description}
          maxLength={DESCRIPTION_MAX}
          rows={4}
          placeholder={t("dashboard.calendar.createForm.descriptionPlaceholder")}
          onChange={(e) => onChange({ description: e.target.value })}
        />
        <HelperText>{t("dashboard.calendar.createForm.descriptionHelper", { max: DESCRIPTION_MAX })}</HelperText>
        <CharCount>
          {description.length}/{DESCRIPTION_MAX}
        </CharCount>
      </FieldGroup>

      <ButtonRow>
        <Button
          text={t("dashboard.calendar.createForm.cancel")}
          onClick={onCancel}
          backgroundcolor="transparent"
          border="var(--border-width-medium) solid var(--color-aubergine)"
          textColor="var(--color-aubergine)"
          width="auto"
          padding="var(--button-padding)"
        />
        <Button
          text={t("dashboard.calendar.createForm.next")}
          onClick={onNext}
          disabled={!isNextEnabled}
          width="auto"
          padding="var(--button-padding)"
        />
      </ButtonRow>
    </>
  );
}
