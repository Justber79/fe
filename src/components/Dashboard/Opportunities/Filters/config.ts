import { TFunction } from "i18next";
import { EntityTableName, QueryParamsKeys } from "need4deed-sdk";
import { SelectionFilterConfigs } from "../../common/CardsFilter/selectionFilters";
import { ViewMode } from "../../common/types";
import { OpportunityCardsFilter } from "./types";

const languageLabel = (value: string, t: TFunction) => {
  const translationKey = `languageNames.${value.toLowerCase()}`;
  const translated = t(translationKey);
  return translated !== translationKey ? translated : value;
};

const notInListView = ({ viewMode }: { viewMode: ViewMode }) => viewMode !== ViewMode.LIST;

export const opportunityFilterConfigs: SelectionFilterConfigs<OpportunityCardsFilter> = {
  type: {
    header: "dashboard.opportunities.filters.type.header",
    label: (value, t) => t(`dashboard.opportunities.filters.type.${value}`),
  },
  status: {
    header: "dashboard.opportunities.filters.status.header",
    label: (value, t) => t(`dashboard.opportunities.filters.status.${value}`),
    isVisible: ({ isVolunteer }) => !isVolunteer,
  },
  [QueryParamsKeys.DISTRICT]: {
    header: "dashboard.volunteers.filters.district",
    option: EntityTableName.DISTRICT,
    isVisible: notInListView,
  },
  [QueryParamsKeys.LANGUAGE]: {
    header: "dashboard.volunteers.filters.languages",
    option: EntityTableName.LANGUAGE,
    label: languageLabel,
    isVisible: notInListView,
  },
  [EntityTableName.ACTIVITY]: {
    header: "dashboard.volunteers.filters.activities",
    option: EntityTableName.ACTIVITY,
  },
  [EntityTableName.SKILL]: {
    header: "dashboard.volunteers.filters.skills",
    option: EntityTableName.SKILL,
  },
};
