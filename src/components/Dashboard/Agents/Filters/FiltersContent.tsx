import { useTranslation } from "react-i18next";
import { AgentCardsFilter } from "./types";
import AccordionFilter from "../../common/CardsFilter/AccordionFilter";
import { getVisibleSelectionFilterSections } from "../../common/CardsFilter/selectionFilters";
import { SetFilter } from "../../common/CardsFilter/types";
import { createAgentFilterSections } from "./helpers";
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
  const { isAuthorized, isAgent, isVolunteer } = useAuth();

  const sections = getVisibleSelectionFilterSections(createAgentFilterSections(filter, setFilter, t), {
    viewMode,
    isAuthorized,
    isAgent,
    isVolunteer,
  });

  return (
    <FiltersContentContainer data-testid="agent-filters-content">
      {sections.map(({ key, config, items }) => (
        <AccordionFilter key={key} header={t(config.header)} items={items} />
      ))}
    </FiltersContentContainer>
  );
}
