import { useUpdateVolunteerProfile } from "@/hooks/useUpdateVolunteerProfile";
import { ApiVolunteerGet, VolunteerStateTypeType } from "need4deed-sdk";
import { useStatusDialog, UseStatusDialogReturn } from "../common/useStatusDialog";

export type UseVolunteerTypeDialogReturn = UseStatusDialogReturn<VolunteerStateTypeType | "">;

export const useVolunteerTypeDialog = (volunteer: ApiVolunteerGet): UseVolunteerTypeDialogReturn => {
  const { mutate: updateProfile } = useUpdateVolunteerProfile(volunteer.id);

  const onSave = (statusType: VolunteerStateTypeType | "", { onSuccess }: { onSuccess: () => void }) => {
    if (!statusType) return;
    updateProfile({ statusType }, { onSuccess });
  };

  const dialog = useStatusDialog<VolunteerStateTypeType | "">({
    initial: volunteer.statusType ?? "",
    onSave,
    isSaveDisabled: (selected, original) => !selected || selected === original,
  });

  const openDialog = () => {
    dialog.setSelected(volunteer.statusType ?? "");
    dialog.openDialog();
  };

  return { ...dialog, openDialog };
};
