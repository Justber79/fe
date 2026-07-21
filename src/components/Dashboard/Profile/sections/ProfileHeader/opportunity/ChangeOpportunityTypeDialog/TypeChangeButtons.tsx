"use client";
import {
  DialogButtonGroup,
  LargePrimaryButton,
  PrimaryCancelButton,
} from "../../../VolunteerProfileDocument/shared/DialogButtonGroup";

type Props = {
  onCancel: () => void;
  onSave: () => void;
  cancelLabel: string;
  saveLabel: string;
  saveDisabled?: boolean;
  loading?: boolean;
};

export const TypeChangeButtons = ({ onCancel, onSave, cancelLabel, saveLabel, saveDisabled, loading }: Props) => {
  const disabled = (saveDisabled ?? false) || (loading ?? false);

  return (
    <DialogButtonGroup>
      <PrimaryCancelButton onClick={onCancel} disabled={loading}>
        {cancelLabel}
      </PrimaryCancelButton>
      <LargePrimaryButton onClick={onSave} disabled={disabled} $disabled={disabled}>
        {saveLabel}
      </LargePrimaryButton>
    </DialogButtonGroup>
  );
};
