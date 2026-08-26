"use client";
import Button from "@/components/core/button/Button/Button";
import { Heading2, Heading3 } from "@/components/styled/text";
import { useTranslation } from "react-i18next";
import { EventFormData } from "./CreateEvent";
import { ButtonRow, CharCount, FieldGroup, FieldLabel, HelperText, StyledInput, StyledTextarea } from "./styles";

const TITLE_MAX = 128;
export const DESCRIPTION_MAX = 512;

interface Props {
  title: string;
  description: string;
  onChange: (fields: Partial<EventFormData>) => void;
  onNext: () => void;
  onCancel: () => void;
  isNextEnabled: boolean;
}

export function StepTitle({ title, description, onChange, onNext, onCancel, isNextEnabled }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Heading2>{t("dashboard.calendar.createForm.eventTitle")}</Heading2>

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
