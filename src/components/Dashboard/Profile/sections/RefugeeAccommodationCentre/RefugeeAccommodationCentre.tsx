"use client";

import { ApiOpportunityGet, Lang } from "need4deed-sdk";
import { RefugeeAccommodationCentreDisplay } from "./RefugeeAccommodationCentreDisplay";
import { useTranslation } from "react-i18next";

type Props = {
  opportunity: ApiOpportunityGet;
};

export function RefugeeAccommodationCentre({ opportunity }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language as Lang;
  const districtTitle = opportunity.agent.district?.title?.[lang] ?? opportunity.agent.district?.title?.de ?? "";

  return (
    <RefugeeAccommodationCentreDisplay
      name={opportunity.agent.name}
      address={opportunity.agent.address}
      district={districtTitle}
    />
  );
}
