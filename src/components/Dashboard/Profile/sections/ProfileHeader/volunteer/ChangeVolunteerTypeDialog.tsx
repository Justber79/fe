"use client";
import { VolunteerStateTypeType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { ChangeStatusDialog, createVolunteerTypeLabelMap } from "../common";
import { UseVolunteerTypeDialogReturn } from "./useVolunteerTypeDialog";

type Props = {
  dialog: UseVolunteerTypeDialogReturn;
};

export const ChangeVolunteerTypeDialog = ({
  dialog: { isOpen, closeDialog, selected, setSelected, saveDialog, isSaveDisabled },
}: Props) => {
  const { t } = useTranslation();
  const volunteerTypeLabelMap = createVolunteerTypeLabelMap(t);

  const options = Object.values(VolunteerStateTypeType).map((type) => ({
    value: type,
    label: volunteerTypeLabelMap[type],
  }));

  return (
    <ChangeStatusDialog<VolunteerStateTypeType | "">
      testId="change-volunteer-type-dialog"
      isOpen={isOpen}
      title={t("dashboard.volunteerProfile.volunteerHeader.volunteerTypeModal_title")}
      options={options}
      selected={selected}
      onSelect={setSelected}
      onSave={saveDialog}
      onCancel={closeDialog}
      isSaveDisabled={isSaveDisabled}
      radioName="volunteer-type"
      saveLabel={t("dashboard.volunteerProfile.volunteerHeader.modalData.save")}
      cancelLabel={t("dashboard.volunteerProfile.volunteerHeader.modalData.cancel")}
    />
  );
};
