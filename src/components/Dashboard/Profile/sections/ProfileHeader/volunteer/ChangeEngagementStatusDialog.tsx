"use client";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { de, enUS } from "date-fns/locale";
import { VolunteerStateEngagementType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { ChangeStatusDialog, DateFieldContainer } from "../common";
import { createEngagementLabelMap, ENGAGEMENT_DESCRIPTION_KEYS, MANUAL_ENGAGEMENT_STATUSES } from "./constants";
import { UseEngagementStatusDialogReturn } from "./useEngagementStatusDialog";

type Props = {
  dialog: UseEngagementStatusDialogReturn;
};

export const ChangeEngagementStatusDialog = ({
  dialog: { isOpen, closeDialog, selected, setSelected, dateReturn, setDateReturn, saveDialog, isSaveDisabled },
}: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : enUS;
  const engagementLabelMap = createEngagementLabelMap(t);

  const options = MANUAL_ENGAGEMENT_STATUSES.map((status) => ({
    value: status,
    label: engagementLabelMap[status],
    description: t(
      `dashboard.volunteerProfile.volunteerHeader.engagementStatus_options.${ENGAGEMENT_DESCRIPTION_KEYS[status]}`,
    ),
    extra:
      status === VolunteerStateEngagementType.TEMP_UNAVAILABLE && selected === status ? (
        <DateFieldContainer>
          <DatePickerWithLabel
            date={dateReturn}
            onSelect={setDateReturn}
            locale={locale}
            allowFuture={true}
            label={t(
              "dashboard.volunteerProfile.volunteerHeader.modalData.options.dateReturn",
              "Return date (optional)",
            )}
          />
        </DateFieldContainer>
      ) : undefined,
  }));

  return (
    <ChangeStatusDialog
      testId="change-engagement-status-dialog"
      isOpen={isOpen}
      title={t("dashboard.volunteerProfile.volunteerHeader.modalData.title")}
      options={options}
      selected={selected}
      onSelect={setSelected}
      onSave={saveDialog}
      onCancel={closeDialog}
      isSaveDisabled={isSaveDisabled}
      radioName="engagement-status"
      saveLabel={t("dashboard.volunteerProfile.volunteerHeader.modalData.save")}
      cancelLabel={t("dashboard.volunteerProfile.volunteerHeader.modalData.cancel")}
    />
  );
};
