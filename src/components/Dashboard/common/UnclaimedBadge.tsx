import { useTranslation } from "react-i18next";
import { StyledBadge } from "./styles";

// A coordinator-created agent with no linked Person/User yet (fe#911) — not a
// StatusValue (statusMaps.ts), just a boolean flag, so this stays a small
// standalone badge rather than being forced into that enum-keyed system.
export const UnclaimedBadge = () => {
  const { t } = useTranslation();

  return (
    <StyledBadge $bg="var(--color-grey-50)" $textColor="var(--color-blue-700)" data-testid="unclaimed-badge">
      <span>{t("dashboard.agents.unclaimed")}</span>
    </StyledBadge>
  );
};
