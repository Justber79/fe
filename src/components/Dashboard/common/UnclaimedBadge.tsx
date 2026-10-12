import { useTranslation } from "react-i18next";
import { StyledBadge } from "./styles";

export const UnclaimedBadge = () => {
  const { t } = useTranslation();

  return (
    <StyledBadge $bg="var(--color-grey-50)" $textColor="var(--color-blue-700)" data-testid="unclaimed-badge">
      <span>{t("dashboard.agents.unclaimed")}</span>
    </StyledBadge>
  );
};
