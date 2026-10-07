import { CirclePic } from "@/components/styled/img";
import { Heading4 } from "@/components/styled/text";
import { defaultAvatarURL } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ProfileStatusBadge } from "../ProfileHeader/common";
import { Accordion } from "../shared/Accordion";
import { getDatePrefixKey } from "../shared/getDatePrefixKey";
import { createEngagementStatusLabelMap, createStatusLabelMap, MappedVolunteerAgent } from "./types";
import { VolunteerDetail } from "./VolunteerDetail";

type Props = {
  volunteer: MappedVolunteerAgent;
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

  const handleGoToProfile = () => {
    router.push(`/${i18n.language}/dashboard/volunteers/${volunteer.volunteerId}`);
  };

  const engagementStatusLabels = createEngagementStatusLabelMap(t);
  const statusLabels = createStatusLabelMap(t);

  const headerLeft = (
    <>
      <CirclePic src={getImageUrl(volunteer?.avatarUrl || defaultAvatarURL)} size="40px" />
      <Heading4 margin={0} color="var(--color-midnight)">
        {volunteer?.name}
      </Heading4>
      <ProfileStatusBadge status={volunteer?.engagement} label={engagementStatusLabels[volunteer?.engagement]} />
      <ProfileStatusBadge status={volunteer?.volunteeringType} label={statusLabels[volunteer?.volunteeringType]} />
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
