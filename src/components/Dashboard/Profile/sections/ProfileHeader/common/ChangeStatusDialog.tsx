"use client";
import { Modal } from "@/components/core/modal/Modal";
import { ReactNode } from "react";
import {
  DialogButtonGroup,
  LargePrimaryButton,
  PrimaryCancelButton,
} from "../../VolunteerProfileDocument/shared/DialogButtonGroup";
import {
  ModalContainer,
  ModalTitle,
  OptionDescription,
  OptionItem,
  OptionLabel,
  OptionsContainer,
  RadioOption,
} from "./dialogStyles";

type StatusOption<T extends string | number> = {
  value: T;
  label: string;
  description: string;
  extra?: ReactNode;
};

type Props<T extends string | number> = {
  testId: string;
  isOpen: boolean;
  title: string;
  options: StatusOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaveDisabled: boolean;
  radioName: string;
  saveLabel: string;
  cancelLabel: string;
};

export const ChangeStatusDialog = <T extends string | number>({
  testId,
  isOpen,
  title,
  options,
  selected,
  onSelect,
  onSave,
  onCancel,
  isSaveDisabled,
  radioName,
  saveLabel,
  cancelLabel,
}: Props<T>) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalContainer data-testid={testId}>
        <ModalTitle>{title}</ModalTitle>

        <OptionsContainer>
          {options.map(({ value, label, description, extra }) => (
            <OptionItem key={value}>
              <RadioOption>
                <input type="radio" name={radioName} checked={selected === value} onChange={() => onSelect(value)} />
                <OptionLabel>{label}</OptionLabel>
              </RadioOption>
              <OptionDescription>{description}</OptionDescription>
              {extra}
            </OptionItem>
          ))}
        </OptionsContainer>

        <DialogButtonGroup>
          <PrimaryCancelButton onClick={onCancel}>{cancelLabel}</PrimaryCancelButton>
          <LargePrimaryButton onClick={onSave} disabled={isSaveDisabled} $disabled={isSaveDisabled}>
            {saveLabel}
          </LargePrimaryButton>
        </DialogButtonGroup>
      </ModalContainer>
    </Modal>
  );
};
