import { useTranslation } from "react-i18next";
import { Button } from "@/components/core/button";
import { SetFilter } from "./types";
import { getClearFilter } from "./helpers";

interface Props<TFilter> {
  setFilter: SetFilter<TFilter>;
  filter: TFilter;
}

export default function ClearAllFilters<TFilter extends object>({ setFilter, filter }: Props<TFilter>) {
  const { t } = useTranslation();

  const handleClick = () => {
    const clearFilter = getClearFilter(filter);
    setFilter(clearFilter);
  };

  return (
    <Button
      text={t("dashboard.filters.clearAll")}
      onClick={handleClick}
      backgroundcolor="var(--color-white)"
      textColor="var(--color-midnight)"
      height="var(--filters-clear-all-button-height)"
      textFontSize="var(--filters-clear-all-button-text-font-size)"
      textFontWeight="var(--filters-clear-all-button-text-font-weight)"
      padding="var(--filters-clear-all-button-padding)"
    />
  );
}
