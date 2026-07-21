"use client";
import { useTranslation } from "react-i18next";
import { Id, OpportunityType, VolunteerStateTypeType } from "need4deed-sdk";
import { useUpdateOpportunityType } from "@/hooks/useUpdateOpportunityType";
import { TypeChangeButtons } from "./TypeChangeButtons";

type Props = {
  opportunityId: Id;
  opportunityType: VolunteerStateTypeType;
  onCancel: () => void;
};

export const PlainTypeChangeForm = ({ opportunityId, opportunityType, onCancel }: Props) => {
  const { t } = useTranslation();
  const { mutateAsync: updateType, isPending } = useUpdateOpportunityType(opportunityId);

  const handleSave = async () => {
    await updateType({
      opportunity_type: opportunityType as OpportunityType,
    });
    onCancel();
  };

  return (
    <TypeChangeButtons
      onCancel={onCancel}
      onSave={handleSave}
      cancelLabel={t("dashboard.opportunityProfile.typeModal.cancel")}
      saveLabel={t("dashboard.opportunityProfile.typeModal.save")}
      loading={isPending}
    />
  );
};
