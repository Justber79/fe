import { useUpdateVolunteerStatus, VolunteerStatusUpdateData } from "@/hooks/useUpdateVolunteerStatus";
import { ApiVolunteerGet, VolunteerStateEngagementType } from "need4deed-sdk";
import { useState } from "react";
import { useStatusDialog, UseStatusDialogReturn } from "../common/useStatusDialog";

export type UseEngagementStatusDialogReturn = UseStatusDialogReturn<VolunteerStateEngagementType> & {
  dateReturn: Date | undefined;
  setDateReturn: (date: Date | undefined) => void;
};

export const useEngagementStatusDialog = (volunteer: ApiVolunteerGet): UseEngagementStatusDialogReturn => {
  const { mutate: updateStatus } = useUpdateVolunteerStatus(volunteer.id);
  const initialDate = volunteer.dateReturn ? new Date(volunteer.dateReturn) : undefined;

  const [dateReturn, setDateReturn] = useState<Date | undefined>(initialDate);

  const isSaveDisabled = (selected: VolunteerStateEngagementType, original: VolunteerStateEngagementType) =>
    selected === original &&
    (selected !== VolunteerStateEngagementType.TEMP_UNAVAILABLE || dateReturn?.getTime() === initialDate?.getTime());

  const onSave = (status: VolunteerStateEngagementType, { onSuccess }: { onSuccess: () => void }) => {
    const payload: VolunteerStatusUpdateData = {
      statusEngagement: status,
      dateReturn:
        status === VolunteerStateEngagementType.TEMP_UNAVAILABLE && dateReturn ? dateReturn.toISOString() : null,
    };
    updateStatus(payload, { onSuccess });
  };

  const dialog = useStatusDialog({
    initial: volunteer.statusEngagement,
    onSave,
    isSaveDisabled,
  });

  const openDialog = () => {
    setDateReturn(initialDate);
    dialog.openDialog();
  };

  const closeDialog = () => {
    setDateReturn(initialDate);
    dialog.closeDialog();
  };

  return {
    ...dialog,
    openDialog,
    closeDialog,
    dateReturn,
    setDateReturn,
  };
};
