import { TrainIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { StatusTag } from "./StatusTag";

type Props = {
  min: number | null;
  max: number | null;
};

export const CommuteBadge = ({ min, max }: Props) => {
  const { t } = useTranslation();

  if (min === null || max === null) {
    return null;
  }

  const textColor = "var(--color-blue-700)";

  return (
    <StatusTag
      bg="var(--color-grey-50)"
      textColor={textColor}
      icon={<TrainIcon size={20} color={textColor} />}
      data-testid="commute-badge"
    >
      {t("dashboard.common.commuteRange", { min, max })}
    </StatusTag>
  );
};
