"use client";
import Button from "@/components/core/button/Button/Button";
import { Heading2 } from "@/components/styled/text";
import { useTranslation } from "react-i18next";
import { EventFormData } from "./CreateEvent";
import { ButtonRow, FieldGroup, FieldRow, FieldRowLabel, StyledInput } from "./styles";

interface Props {
  date: string;
  time: string;
  onChange: (fields: Partial<EventFormData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitEnabled: boolean;
}

export function StepDateTime({ date, time, onChange, onBack, onSubmit, isSubmitEnabled }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Heading2>{t("dashboard.calendar.createForm.dateTime")}</Heading2>

      <FieldGroup>
        <FieldRow>
          <FieldRowLabel>{t("dashboard.calendar.createForm.date")}</FieldRowLabel>
          <StyledInput type="date" value={date} onChange={(e) => onChange({ date: e.target.value })} />
        </FieldRow>

        <FieldRow>
          <FieldRowLabel>{t("dashboard.calendar.createForm.time")}</FieldRowLabel>
          <StyledInput type="time" value={time} onChange={(e) => onChange({ time: e.target.value })} />
        </FieldRow>
      </FieldGroup>

      <ButtonRow>
        <Button
          text={t("dashboard.calendar.createForm.back")}
          onClick={onBack}
          backgroundcolor="transparent"
          border="var(--border-width-medium) solid var(--color-aubergine)"
          textColor="var(--color-aubergine)"
          width="auto"
          padding="var(--button-padding)"
        />
        <Button
          text={t("dashboard.calendar.createForm.submit")}
          onClick={onSubmit}
          disabled={!isSubmitEnabled}
          width="auto"
          padding="var(--button-padding)"
        />
      </ButtonRow>
    </>
  );
}
