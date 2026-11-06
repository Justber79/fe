import { Heading4 } from "@/components/styled/text";
import { ApiOpportunityVolunteerGet, OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Accordion } from "../shared/Accordion";
import { getDatePrefixKey } from "../shared/getDatePrefixKey";
import { AccordionActionProps } from "../shared/types";
import OpportunityDetail from "./OpportunityDetail";
import { CommuteBadge } from "../../common/CommuteBadge";
import { HeaderLeftWrapper } from "../shared/accordionStyles";

type Props = {
  opportunity: ApiOpportunityVolunteerGet;
  currentStatus: OpportunityVolunteerStatusType;
} & AccordionActionProps;

export default function AccordionOpportunity({ opportunity, currentStatus, ...actionProps }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const handleGoToProfile = () => {
    router.push(`/${i18n.language}/dashboard/opportunities/${opportunity.opportunityId}`);
  };

  const headerLeft = (
    <HeaderLeftWrapper>
      <Heading4 margin={0} color="var(--color-midnight)">
        {opportunity.title}
      </Heading4>
      <CommuteBadge min={1} max={5} />
    </HeaderLeftWrapper>
  );

  const hasActions = !!actionProps.onMatch;
  const hasActivityLog =
    currentStatus === OpportunityVolunteerStatusType.ACTIVE || currentStatus === OpportunityVolunteerStatusType.PAST;

  return (
    <Accordion
      headerLeft={headerLeft}
      subtitle={`${t(getDatePrefixKey(currentStatus))} ${new Date(opportunity.updatedAt).toLocaleDateString("de-DE")}`}
      onGoToProfile={handleGoToProfile}
    >
      {hasActions || hasActivityLog ? (
        <OpportunityDetail opportunity={opportunity} currentStatus={currentStatus} {...actionProps} />
      ) : null}
    </Accordion>
  );
}
