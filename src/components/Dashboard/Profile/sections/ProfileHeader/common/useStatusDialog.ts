import { useState } from "react";

export type UseStatusDialogReturn<T extends string | number> = {
  isOpen: boolean;
  selected: T;
  original: T;
  isSaveDisabled: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  saveDialog: () => void;
  setSelected: (value: T) => void;
};

type StatusDialogConfig<T extends string | number> = {
  initial: T;
  onSave: (value: T, callbacks: { onSuccess: () => void }) => void;
  isSaveDisabled?: (selected: T, original: T) => boolean;
};

export const useStatusDialog = <T extends string | number>({
  initial,
  onSave,
  isSaveDisabled: customIsSaveDisabled,
}: StatusDialogConfig<T>): UseStatusDialogReturn<T> => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<T>(initial);

  const isSaveDisabled = customIsSaveDisabled ? customIsSaveDisabled(selected, initial) : selected === initial;

  const openDialog = () => setIsOpen(true);

  const closeDialog = () => {
    setSelected(initial);
    setIsOpen(false);
  };

  const saveDialog = () => {
    onSave(selected, {
      onSuccess: () => setIsOpen(false),
    });
  };

  return {
    isOpen,
    selected,
    original: initial,
    isSaveDisabled,
    openDialog,
    closeDialog,
    saveDialog,
    setSelected,
  };
};
