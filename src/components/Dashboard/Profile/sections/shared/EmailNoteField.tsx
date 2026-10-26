import { TextArea } from "@/components/core/common";
import { EMAIL_NOTE_MAX_LENGTH } from "need4deed-sdk";
import { useTranslation } from "react-i18next";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function EmailNoteField({ value, onChange, disabled }: Props) {
  const { t } = useTranslation();

  return (
    <TextArea
      label={t("dashboard.emailNote.label")}
      placeholder={t("dashboard.emailNote.placeholder")}
      value={value}
      onChange={onChange}
      maxLength={EMAIL_NOTE_MAX_LENGTH}
      rows={3}
      disabled={disabled}
    />
  );
}
