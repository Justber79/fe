import React from "react";
import { Heading3 } from "@/components/styled/text";
import { RelevantOppsWrapper } from "../styles";
import { useTranslation } from "react-i18next";
import { VolunteerMostRelevantOppCards } from "./VolunteerMostRelevantOppCards";

type Props = {
  volunteerId?: number;
};

export function VolunteerHomeContent({ volunteerId }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <RelevantOppsWrapper>
        <Heading3 margin={0}>{t("dashboard.home.content.mostRelevantOpp")}</Heading3>
        <span>{t("dashboard.home.content.mostRelevantOppDesc")}</span>
      </RelevantOppsWrapper>
      <VolunteerMostRelevantOppCards volunteerId={volunteerId} />
    </>
  );
}
