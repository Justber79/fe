import { useUpdateVolunteerProfile } from "@/hooks/useUpdateVolunteerProfile";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useStatusDialog, UseStatusDialogReturn } from "../common/useStatusDialog";

export const NO_OWNER = 0;

export type UseVolunteerOwnerDialogReturn = UseStatusDialogReturn<number>;

export const useVolunteerOwnerDialog = (volunteer: ApiVolunteerGet): UseVolunteerOwnerDialogReturn => {
  const { mutate: updateProfile } = useUpdateVolunteerProfile(volunteer.id);
  const current = volunteer.ownerAgentId ?? NO_OWNER;

  const onSave = (ownerAgentId: number, { onSuccess }: { onSuccess: () => void }) => {
    updateProfile({ ownerAgentId: ownerAgentId === NO_OWNER ? null : ownerAgentId }, { onSuccess });
  };

  const dialog = useStatusDialog<number>({ initial: current, onSave });

  const openDialog = () => {
    dialog.setSelected(current);
    dialog.openDialog();
  };

  return { ...dialog, openDialog };
};
