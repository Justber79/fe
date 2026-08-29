import Button from "@/components/core/button/Button/Button";
import { useTranslation } from "react-i18next";

interface Props {
  onCreate: () => void;
}

export function CreateEventCta({ onCreate }: Props) {
  const { t } = useTranslation();
  return (
    <Button
      text={t("dashboard.calendar.createEvent")}
      onClick={onCreate}
      width="auto"
      padding="var(--button-padding)"
    />
  );
}
