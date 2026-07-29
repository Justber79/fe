import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/core/button";

import { Actions } from "./accordionStyles";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { useState } from "react";

type AccordionActionsProps = {
  onNotAMatch: () => void;
  onMatch?: () => void;
  onMarkAsActive?: () => void;
  onMarkAsPast?: () => void;
};

export const AccordionActions = ({ onNotAMatch, onMatch, onMarkAsActive, onMarkAsPast }: AccordionActionsProps) => {
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
  onMatch: () => void;
  onNotAMatch: () => void;
  onMarkAsActive: () => void;
  onMarkAsPast: () => void;
};

export const StatusAccordionActions = ({
  currentStatus,
  onMatch,
  onNotAMatch,
  onMarkAsActive,
  onMarkAsPast,
}: StatusAccordionActionsProps) => {
  if (currentStatus === OpportunityVolunteerStatusType.PENDING) {
    return <AccordionActions onNotAMatch={onNotAMatch} onMatch={onMatch} />;
  }
  if (currentStatus === OpportunityVolunteerStatusType.MATCHED) {
    return <AccordionActions onNotAMatch={onNotAMatch} onMarkAsActive={onMarkAsActive} />;
  }
  if (currentStatus === OpportunityVolunteerStatusType.ACTIVE) {
    return <AccordionActions onNotAMatch={onNotAMatch} onMarkAsPast={onMarkAsPast} />;
  }
  return null;
};
