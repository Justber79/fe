import { Button } from "@/components/core/button";
import { Heading4 } from "@/components/styled/text";
import { apiPathOption } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { recommendedOpportunitiesKey, useRecommendedOpportunities } from "@/hooks/useRecommendedMatches";
import { useSuggestVolunteerOpportunity } from "@/hooks/useSuggestVolunteerOpportunity";
import { useQueryClient } from "@tanstack/react-query";
import {
  ApiOpportunityGetList,
  ApiOptionLists,
  ApiVolunteerOpportunityGetList,
  Id,
  OpportunityVolunteerStatusType,
} from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { OpportunityCard } from "../../../Opportunities/OpportunityCard";
import { Accordion } from "../shared/Accordion";
import { SuggestDialog } from "../VolunteerOpportunities/SuggestDialog";
import { RecommendedContainer } from "./styles";

type Props = {
  volunteerId: Id;
  volunteerName: string;
};

export function RecommendedOpportunities({ volunteerId, volunteerName }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<ApiOpportunityGetList>();
  const { data: opportunities = [] } = useRecommendedOpportunities(volunteerId, true);
  const { data: options } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });

  const { mutate: suggest, isPending } = useSuggestVolunteerOpportunity(() => {
    setSelected(undefined);
    queryClient.invalidateQueries({ queryKey: recommendedOpportunitiesKey(volunteerId) });
  }, ["volunteer-opportunities", String(volunteerId)]);

  if (!opportunities.length) return null;

  return (
    <RecommendedContainer aria-label={t("dashboard.recommended.opportunitiesTitle")}>
      <Heading4 margin={0} color="var(--color-grey-500)">
        {t("dashboard.recommended.opportunitiesTitle")}
      </Heading4>
      {opportunities.map((opportunity) => (
        <Accordion
          key={opportunity.id}
          data-testid="recommended-opportunity"
          headerLeft={
            <Heading4 margin={0} color="var(--color-midnight)">
              {opportunity.title}
            </Heading4>
          }
          subtitle={opportunity.agentTitle}
          onGoToProfile={() =>
            router.push(`/${i18n.language}/dashboard/opportunities/${opportunity.id}?volunteer=${volunteerId}`)
          }
          headerAction={
            <Button
              text={t("dashboard.volunteerProfile.suggestButtonName")}
              onClick={() => setSelected(opportunity)}
              height="40px"
              padding="0 var(--spacing-16)"
            />
          }
        >
          <OpportunityCard
            opportunity={opportunity as ApiVolunteerOpportunityGetList}
            volunteerId={String(volunteerId)}
            activitiesList={options?.activity ?? undefined}
            districtsList={options?.district ?? undefined}
          />
        </Accordion>
      ))}
      {selected && (
        <SuggestDialog
          volunteerName={volunteerName}
          opportunityName={selected.title}
          onCancel={() => setSelected(undefined)}
          onConfirm={(emailNote) =>
            suggest({
              opportunityId: Number(selected.id),
              volunteerId: Number(volunteerId),
              status: OpportunityVolunteerStatusType.PENDING,
              emailNote,
            })
          }
          isPending={isPending}
        />
      )}
    </RecommendedContainer>
  );
}
