import { CheckCircleIcon } from "@phosphor-icons/react";
import { Heading4 } from "@/components/styled/text";
import { defaultAvatarVolunteerProfile } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { ApiVolunteerOpportunityGet, OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { isBriefedAccompanying } from "../ProfileHeader/common";
import StatusBadge from "../../common/StatusBadge";
import { Accordion } from "../shared/Accordion";
import { getDatePrefixKey } from "../shared/getDatePrefixKey";
import { AvatarImg } from "./styles";
import VolunteerDetail from "./VolunteerDetail";

type Props = {
  volunteer: ApiVolunteerOpportunityGet;
  currentStatus: OpportunityVolunteerStatusType;
  onMatch: () => void;
  onNotAMatch: () => void;
  onMarkAsActive: () => void;
  onMarkAsPast: () => void;
};

export const AccordionVolunteer = ({
  volunteer,
  currentStatus,
  onMatch,
  onNotAMatch,
  onMarkAsActive,
  onMarkAsPast,
}: Props) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { volunteerId, name, avatarUrl, engagement, volunteeringType, communication } = volunteer;

  const showBriefedCheck = isBriefedAccompanying(volunteeringType, communication);

  const handleGoToProfile = () => {
    router.push(`/${i18n.language}/dashboard/volunteers/${volunteerId}`);
  };

  const resolvedAvatarUrl = getImageUrl(avatarUrl || defaultAvatarVolunteerProfile);

  const headerLeft = (
    <>
      <AvatarImg src={resolvedAvatarUrl} alt={name} />
      <Heading4 margin={0} color="var(--color-midnight)">
        {name}
      </Heading4>
      <StatusBadge status={engagement} />
      <StatusBadge status={volunteeringType} />
      {showBriefedCheck && <CheckCircleIcon size={20} color="var(--color-green-700)" weight="fill" />}
    </>
  );

  return (
    <Accordion
      data-testid="volunteer-accordion"
      headerLeft={headerLeft}
      subtitle={`${t(getDatePrefixKey(currentStatus))} ${new Date(volunteer.updatedAt).toLocaleDateString("de-DE")}`}
      onGoToProfile={handleGoToProfile}
    >
      <VolunteerDetail
        volunteer={volunteer}
        currentStatus={currentStatus}
        onMatch={onMatch}
        onNotAMatch={onNotAMatch}
        onMarkAsActive={onMarkAsActive}
        onMarkAsPast={onMarkAsPast}
      />
    </Accordion>
  );
};
