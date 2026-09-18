import { useTranslation } from "react-i18next";
import { IconName } from "../../../core/button/Button/icon";
import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";
import { Button } from "../../../core/button";

interface Props {
  setIsFiltersOpen: (isOpen: boolean) => void;
}

export default function FiltersButton({ setIsFiltersOpen }: Props) {
  const { t } = useTranslation();
  const screenSize = useScreenType();
  const isMobile = screenSize === ScreenTypes.MOBILE;

  return (
    <Button
      text={isMobile ? undefined : t("dashboard.filters.button")}
      backgroundcolor="var(--color-aubergine)"
      height="var(--opportunities-filters-button-height)"
      width={isMobile ? "var(--opportunities-filters-button-width)" : undefined}
      onClick={() => setIsFiltersOpen(true)}
      iconName={IconName.Faders}
      iconSize="var(--opportunities-filters-button-icon-size)"
      aria-label={t("dashboard.filters.button")}
    />
  );
}
