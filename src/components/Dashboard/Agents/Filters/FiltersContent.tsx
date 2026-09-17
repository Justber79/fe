import { useTranslation } from "react-i18next";
import { AgentCardsFilter } from "./types";
import AccordionFilter from "../../common/CardsFilter/AccordionFilter";
import { SetFilter } from "../../common/CardsFilter/types";
import { createAgentFilterItems } from "./helpers";
import { FiltersContentContainer } from "./styles";
import { useAuth } from "@/hooks/useAuth";
import { ViewMode } from "../../common/types";

type Props = {
  filter: AgentCardsFilter;
  setFilter: SetFilter<AgentCardsFilter>;
  viewMode: ViewMode;
};

export default function FiltersContent({ setFilter, filter, viewMode }: Props) {
  const { t } = useTranslation();
  const { isAuthorized } = useAuth();

  const { districtFilters, volunteerSearchFilters, typeFilters, engagementStatusFilters, servicesFilters } =
    createAgentFilterItems(filter, setFilter, t);

  return (
    <FiltersContentContainer data-testid="agent-filters-content">
      <AccordionFilter header={t("dashboard.agents.filters.type.header")} items={typeFilters} />
      {isAuthorized && (
        <AccordionFilter header={t("dashboard.agents.filters.volunteerSearch.header")} items={volunteerSearchFilters} />
      )}
      {viewMode === ViewMode.CARDS && (
        <AccordionFilter header={t("dashboard.agents.filters.district.header")} items={districtFilters} />
      )}
      <AccordionFilter header={t("dashboard.agents.filters.engagementStatus.header")} items={engagementStatusFilters} />
      <AccordionFilter header={t("dashboard.agents.filters.services.header")} items={servicesFilters} />
    </FiltersContentContainer>
  );
}
