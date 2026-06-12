import { useSearchParams } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { OpportunityInfo } from "../types";

export function OpportunityTitle() {
  const { t } = useTranslation();
  const opportunityParams = useSearchParams();

  const opportunity: OpportunityInfo = {
    id: opportunityParams.get("id") || "",
    title: opportunityParams.get("title") || "",
  };
  return (
    <h6>
      {t("form.becomeVolunteer.thanks")}: <i>{opportunity.title}</i>
    </h6>
  );
}
