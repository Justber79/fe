import { Button } from "@/components/core/button";
import { Heading4 } from "@/components/styled/text";
import { defaultAvatarVolunteerProfile } from "@/config/constants";
import { recommendedVolunteersKey, useRecommendedVolunteers } from "@/hooks/useRecommendedMatches";
import { useRequestVolunteerSuggestion } from "@/hooks/useRequestVolunteerSuggestion";
import { useSuggestVolunteerOpportunity } from "@/hooks/useSuggestVolunteerOpportunity";
import { getImageUrl } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ApiVolunteerGetList, Id, OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { VolunteerCard } from "../../../Volunteers/VolunteerCard";
import { AvatarImg } from "../OpportunityVolunteers/styles";
import { SuggestDialog } from "../OpportunityVolunteers/SuggestDialog";
import { Accordion } from "../shared/Accordion";
import { RecommendedContainer } from "./styles";

type RowProps = {
  volunteer: ApiVolunteerGetList;
  opportunityId: Id;
  opportunityTitle: string;
  canSuggest: boolean;
  onSuggest: (volunteer: ApiVolunteerGetList) => void;
};

function RecommendedVolunteerRow({ volunteer, opportunityId, opportunityTitle, canSuggest, onSuggest }: RowProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { requestSuggestion, isPending, isContactLoading } = useRequestVolunteerSuggestion(volunteer.id, !canSuggest);

  return (
    <Accordion
      data-testid="recommended-volunteer"
      headerLeft={
        <>
          <AvatarImg src={getImageUrl(volunteer.avatarUrl || defaultAvatarVolunteerProfile)} alt={volunteer.name} />
          <Heading4 margin={0} color="var(--color-midnight)">
            {volunteer.name}
          </Heading4>
        </>
      }
      subtitle=""
      onGoToProfile={() =>
        router.push(`/${i18n.language}/dashboard/volunteers/${volunteer.id}?opportunity=${opportunityId}`)
      }
      headerAction={
        canSuggest ? (
          <Button
            text={t("dashboard.opportunityProfile.volunteersSec.suggestButtonName")}
            height="40px"
            padding="0 var(--spacing-16)"
            onClick={() => onSuggest(volunteer)}
          />
        ) : (
          <Button
            text={t("dashboard.volunteerProfile.requestSuggest.button")}
            height="40px"
            padding="0 var(--spacing-16)"
            onClick={() => requestSuggestion(opportunityTitle)}
            disabled={isPending || isContactLoading}
          />
        )
      }
    >
      <VolunteerCard volunteer={volunteer} opportunityId={String(opportunityId)} />
    </Accordion>
  );
}

type Props = {
  opportunityId: Id;
  opportunityTitle: string;
  canSuggest: boolean;
};

export function RecommendedVolunteers({ opportunityId, opportunityTitle, canSuggest }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<ApiVolunteerGetList>();
  const { data: volunteers = [] } = useRecommendedVolunteers(opportunityId, true);

  const { mutate: suggest, isPending } = useSuggestVolunteerOpportunity(() => {
    setSelected(undefined);
    queryClient.invalidateQueries({ queryKey: recommendedVolunteersKey(opportunityId) });
  }, ["opportunity-volunteers", String(opportunityId)]);

  if (!volunteers.length) return null;

  return (
    <RecommendedContainer aria-label={t("dashboard.recommended.volunteersTitle")}>
      <Heading4 margin={0} color="var(--color-grey-500)">
        {t("dashboard.recommended.volunteersTitle")}
      </Heading4>
      {volunteers.map((volunteer) => (
        <RecommendedVolunteerRow
          key={volunteer.id}
          volunteer={volunteer}
          opportunityId={opportunityId}
          opportunityTitle={opportunityTitle}
          canSuggest={canSuggest}
          onSuggest={setSelected}
        />
      ))}
      {selected && (
        <SuggestDialog
          opportunityName={opportunityTitle}
          volunteerName={selected.name}
          onCancel={() => setSelected(undefined)}
          onConfirm={(emailNote) =>
            suggest({
              opportunityId: Number(opportunityId),
              volunteerId: selected.id,
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
