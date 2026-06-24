import { Heading4 } from "@/components/styled/text";
import { ApiOpportunityVolunteerGet, OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Accordion } from "../shared/Accordion";
import { getDatePrefixKey } from "../shared/getDatePrefixKey";
import { AccordionActionProps } from "../shared/types";
import OpportunityDetail from "./OpportunityDetail";

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
    <Heading4 margin={0} color="var(--color-midnight)">
      {opportunity.title}
    </Heading4>
  );

  return (
    <Accordion
      headerLeft={headerLeft}
      subtitle={`${t(getDatePrefixKey(currentStatus))} ${new Date(opportunity.updatedAt).toLocaleDateString("de-DE")}`}
      onGoToProfile={handleGoToProfile}
    >
      <OpportunityDetail opportunity={opportunity} currentStatus={currentStatus} {...actionProps} />
    </Accordion>
  );
}
