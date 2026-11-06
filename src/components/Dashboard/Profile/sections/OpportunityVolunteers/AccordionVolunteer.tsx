import { EmailNoteControl, MatchHandler } from "../shared/types";
import { CheckCircleIcon, Plus } from "@phosphor-icons/react";
import { Heading4 } from "@/components/styled/text";
import { defaultAvatarVolunteerProfile } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { useActivityLog } from "@/hooks/useActivityLog";
import { ApiVolunteerOpportunityGet, OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityLogDialog } from "../ActivityLog/ActivityLogDialog";
import { AddEntryButton } from "../ActivityLog/styles";
import { ActivityLogFormData } from "../ActivityLog/types";
import { isBriefedAccompanying } from "../ProfileHeader/common";
import StatusBadge from "../../common/StatusBadge";
import { Accordion } from "../shared/Accordion";
import { getDatePrefixKey } from "../shared/getDatePrefixKey";
import { AvatarImg } from "./styles";
import VolunteerDetail from "./VolunteerDetail";

type Props = {
  volunteer: ApiVolunteerOpportunityGet;
  currentStatus: OpportunityVolunteerStatusType;
  hasEditingRights: boolean;
  onMatch: MatchHandler;
  emailNote: EmailNoteControl;
  onNotAMatch: () => void;
  onMarkAsActive: () => void;
  onMarkAsPast: () => void;
};

function AddActivityLogDialog({
  opportunityVolunteerId,
  onClose,
}: {
  opportunityVolunteerId: number;
  onClose: () => void;
}) {
  const { createEntry, isCreating } = useActivityLog(opportunityVolunteerId);

  const handleSave = (data: ActivityLogFormData) => {
    createEntry({ date: data.date, hours: data.hours }, { onSuccess: onClose });
  };

  return <ActivityLogDialog isOpen onClose={onClose} onSave={handleSave} isSaving={isCreating} />;
}

export const AccordionVolunteer = ({
  volunteer,
  currentStatus,
  hasEditingRights,
  onMatch,
  emailNote,
  onNotAMatch,
  onMarkAsActive,
  onMarkAsPast,
}: Props) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { volunteerId, name, avatarUrl, engagement, volunteeringType, communication } = volunteer;

  const canAddEntry = hasEditingRights && currentStatus === OpportunityVolunteerStatusType.ACTIVE;
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
    <>
      <Accordion
        data-testid="volunteer-accordion"
        headerLeft={headerLeft}
        headerAction={
          canAddEntry && (
            <AddEntryButton type="button" onClick={() => setIsDialogOpen(true)} data-testid="volunteer-row-add-entry">
              <Plus size={20} weight="bold" />
              {t("dashboard.activityLog.addEntry")}
            </AddEntryButton>
          )
        }
        subtitle={`${t(getDatePrefixKey(currentStatus))} ${new Date(volunteer.updatedAt).toLocaleDateString("de-DE")}`}
        onGoToProfile={handleGoToProfile}
      >
        <VolunteerDetail
          volunteer={volunteer}
          currentStatus={currentStatus}
          hasEditingRights={hasEditingRights}
          onMatch={onMatch}
          emailNote={emailNote}
          onNotAMatch={onNotAMatch}
          onMarkAsActive={onMarkAsActive}
          onMarkAsPast={onMarkAsPast}
        />
      </Accordion>
      {canAddEntry && isDialogOpen && (
        <AddActivityLogDialog opportunityVolunteerId={volunteer.id} onClose={() => setIsDialogOpen(false)} />
      )}
    </>
  );
};
