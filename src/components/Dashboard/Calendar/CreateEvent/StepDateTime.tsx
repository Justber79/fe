"use client";
import Button from "@/components/core/button/Button/Button";
import { Heading2 } from "@/components/styled/text";
import { useTranslation } from "react-i18next";
import { EventFormData } from "./CreateEvent";
import { ButtonRow, FieldGroup, FieldRow, FieldRowLabel, StyledInput } from "./styles";

interface Props {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  onChange: (fields: Partial<EventFormData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitEnabled: boolean;
}

export function StepDateTime({
  startDate,
  startTime,
  endDate,
  endTime,
  onChange,
  onBack,
  onSubmit,
  isSubmitEnabled,
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Heading2>{t("dashboard.calendar.createForm.dateTime")}</Heading2>

      <FieldGroup>
        <FieldRow>
          <FieldRowLabel>{t("dashboard.calendar.createForm.startDate")}</FieldRowLabel>
          <StyledInput type="date" value={startDate} onChange={(e) => onChange({ startDate: e.target.value })} />
        </FieldRow>

        <FieldRow>
          <FieldRowLabel>{t("dashboard.calendar.createForm.startTime")}</FieldRowLabel>
          <StyledInput type="time" value={startTime} onChange={(e) => onChange({ startTime: e.target.value })} />
        </FieldRow>

        <FieldRow>
          <FieldRowLabel>{t("dashboard.calendar.createForm.endDate")}</FieldRowLabel>
          <StyledInput type="date" value={endDate} onChange={(e) => onChange({ endDate: e.target.value })} />
        </FieldRow>

        <FieldRow>
          <FieldRowLabel>{t("dashboard.calendar.createForm.endTime")}</FieldRowLabel>
          <StyledInput type="time" value={endTime} onChange={(e) => onChange({ endTime: e.target.value })} />
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
