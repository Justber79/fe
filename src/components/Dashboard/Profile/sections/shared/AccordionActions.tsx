import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/core/button";

import { Actions, MatchActions } from "./accordionStyles";
import { EmailNoteField } from "./EmailNoteField";
import { EmailNoteControl, MatchHandler } from "./types";
import { ConfirmationDialog } from "@/components/core/common/ConfirmationDialog";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type AccordionActionsProps = {
  onNotAMatch: () => void;
  onMatch?: () => void;
  matchDisabled?: boolean;
  onMarkAsActive?: () => void;
  onMarkAsPast?: () => void;
};

export const AccordionActions = ({
  onNotAMatch,
  onMatch,
  matchDisabled,
  onMarkAsActive,
  onMarkAsPast,
}: AccordionActionsProps) => {
  const { t } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  return (
    <Actions>
      {showConfirmDialog && (
        <ConfirmationDialog
          title={t("dashboard.volunteerProfile.opportunitiesSec.unmatchDialogTitle")}
          message={t("dashboard.volunteerProfile.opportunitiesSec.unmatchDialogDescription")}
          onCancel={() => setShowConfirmDialog(false)}
          onConfirm={() => {
            onNotAMatch();
            setShowConfirmDialog(false);
          }}
        />
      )}
      <Button
        onClick={() => setShowConfirmDialog(true)}
        text={t("dashboard.volunteerProfile.opportunitiesSec.notAMatch")}
        height="var(--volunteer-profile-opportunities-accordion-actions-button-height)"
        textFontSize="var(--volunteer-profile-opportunities-accordion-actions-button-textFontSize)"
        textColor="var(--color-aubergine)"
        backgroundcolor="var(--color-white)"
        border="var(--volunteer-profile-opportunities-accordion-actions-button-border)"
      />
      {onMatch && (
        <Button
          onClick={onMatch}
          disabled={matchDisabled}
          text={t("dashboard.volunteerProfile.opportunitiesSec.match")}
          height="var(--volunteer-profile-opportunities-accordion-actions-button-height)"
          textFontSize="var(--volunteer-profile-opportunities-accordion-actions-button-textFontSize)"
        />
      )}
      {onMarkAsActive && (
        <Button
          onClick={onMarkAsActive}
          text={t("dashboard.volunteerProfile.opportunitiesSec.markAsActive")}
          height="var(--volunteer-profile-opportunities-accordion-actions-button-height)"
          textFontSize="var(--volunteer-profile-opportunities-accordion-actions-button-textFontSize)"
        />
      )}
      {onMarkAsPast && (
        <Button
          onClick={onMarkAsPast}
          text={t("dashboard.volunteerProfile.opportunitiesSec.markAsPast")}
          height="var(--volunteer-profile-opportunities-accordion-actions-button-height)"
          textFontSize="var(--volunteer-profile-opportunities-accordion-actions-button-textFontSize)"
        />
      )}
    </Actions>
  );
};

type StatusAccordionActionsProps = {
  currentStatus: OpportunityVolunteerStatusType;
  onMatch: MatchHandler;
  emailNote: EmailNoteControl;
  onNotAMatch: () => void;
  onMarkAsActive: () => void;
  onMarkAsPast: () => void;
};

type MatchWithEmailNoteProps = { onMatch: MatchHandler; emailNote: EmailNoteControl; onNotAMatch: () => void };

const MatchWithEmailNote = ({ onMatch, emailNote, onNotAMatch }: MatchWithEmailNoteProps) => {
  const [isMatching, setIsMatching] = useState(false);

  const handleMatch = () => {
    setIsMatching(true);
    Promise.resolve(onMatch())
      .catch(() => undefined)
      .finally(() => setIsMatching(false));
  };

  return (
    <MatchActions>
      <EmailNoteField value={emailNote.value} onChange={emailNote.onChange} disabled={isMatching} />
      <AccordionActions onNotAMatch={onNotAMatch} onMatch={handleMatch} matchDisabled={isMatching} />
    </MatchActions>
  );
};

export const StatusAccordionActions = ({
  currentStatus,
  onMatch,
  emailNote,
  onNotAMatch,
  onMarkAsActive,
  onMarkAsPast,
}: StatusAccordionActionsProps) => {
  const { isAuthorized } = useAuth();
  if (currentStatus === OpportunityVolunteerStatusType.PENDING) {
    return isAuthorized ? (
      <MatchWithEmailNote onMatch={onMatch} emailNote={emailNote} onNotAMatch={onNotAMatch} />
    ) : (
      <AccordionActions onNotAMatch={onNotAMatch} />
    );
  }
  if (currentStatus === OpportunityVolunteerStatusType.MATCHED) {
    return <AccordionActions onNotAMatch={onNotAMatch} onMarkAsActive={onMarkAsActive} />;
  }
  if (currentStatus === OpportunityVolunteerStatusType.ACTIVE) {
    return <AccordionActions onNotAMatch={onNotAMatch} onMarkAsPast={onMarkAsPast} />;
  }
  return null;
};
