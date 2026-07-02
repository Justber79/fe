import { Button } from "@/components/core/button";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { Modal } from "@/components/core/modal";
import { parseISO } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiActivityLogEntry } from "need4deed-sdk";
import { DialogButtonGroup, DialogForm } from "../shared/styles";
import { DialogTitle, FieldError, FieldGroup, FieldLabel, HoursInput } from "./styles";
import { ActivityLogFormData } from "./types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ActivityLogFormData) => void;
  initialData?: ApiActivityLogEntry;
  isSaving?: boolean;
};

const parseHours = (value: string): number | null => {
  const trimmed = value.trim().replace(",", ".");
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
};

export function ActivityLogDialog({ isOpen, onClose, onSave, initialData, isSaving = false }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : enUS;

  const [date, setDate] = useState<Date | undefined>(initialData ? parseISO(String(initialData.date)) : undefined);
  const [hours, setHours] = useState(initialData ? String(initialData.hours) : "");

  const parsedHours = parseHours(hours);
  const isFormValid = !!date && parsedHours !== null;
  const showHoursError = hours.trim() !== "" && parsedHours === null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !date || parsedHours === null) return;
    onSave({ date, hours: parsedHours });
  };

  const dialogTitle = initialData ? t("dashboard.activityLog.editEntry") : t("dashboard.activityLog.addEntry");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <DialogTitle data-testid="activity-log-dialog-title">{dialogTitle}</DialogTitle>

      <DialogForm onSubmit={handleSubmit} data-testid="activity-log-form">
        <FieldGroup>
          <FieldLabel>{t("dashboard.activityLog.date")}</FieldLabel>
          <DatePickerWithLabel
            date={date}
            onSelect={setDate}
            locale={locale}
            label={t("dashboard.activityLog.datePlaceholder")}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel htmlFor="activity-log-hours">{t("dashboard.activityLog.hours")}</FieldLabel>
          <HoursInput
            id="activity-log-hours"
            type="text"
            inputMode="decimal"
            value={hours}
            placeholder={t("dashboard.activityLog.hoursPlaceholder")}
            onChange={(e) => setHours(e.target.value)}
            $hasError={showHoursError}
            aria-invalid={showHoursError}
            data-testid="activity-log-hours-input"
          />
          {showHoursError && (
            <FieldError data-testid="hours-error">{t("dashboard.activityLog.hoursInvalid")}</FieldError>
          )}
        </FieldGroup>

        <DialogButtonGroup>
          <Button
            text={t("dashboard.activityLog.cancel")}
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            backgroundcolor="transparent"
            textColor="var(--color-aubergine)"
            border="var(--border-width-medium) solid var(--color-aubergine)"
          />
          <Button
            text={t("dashboard.activityLog.save")}
            onClick={handleSubmit}
            backgroundcolor={isFormValid ? "var(--color-aubergine)" : "var(--color-grey-50)"}
            textColor={isFormValid ? "var(--color-white)" : "var(--color-grey-400)"}
            disabled={!isFormValid || isSaving}
          />
        </DialogButtonGroup>
      </DialogForm>
    </Modal>
  );
}
