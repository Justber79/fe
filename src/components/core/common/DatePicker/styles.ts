import { Calendar } from "@phosphor-icons/react";
import styled from "styled-components";

export const DatePickerWrapper = styled.div`
  position: relative;
  width: 100%;

  .rdp {
    --rdp-accent-color: var(--color-aubergine);
    --rdp-accent-background-color: var(--color-aubergine);
    --rdp-background-color: var(--color-aubergine-subtle);
    margin: 0;
    font-family: var(--bs-body-font-family);
  }

  .rdp-day_button {
    width: var(--communication-tracker-date-picker-day-size);
    height: var(--communication-tracker-date-picker-day-size);
    border-radius: var(--border-radius-xs);
  }

  .rdp-selected .rdp-day_button {
    background-color: var(--color-aubergine);
    color: var(--color-white);
    font-weight: var(--font-weight-semi-bold);
  }

  .rdp-day_button:hover:not([disabled]) {
    background-color: var(--color-aubergine-subtle);
  }
`;

export const DateInputContainer = styled.div<{ $hasLabel?: boolean }>`
  position: relative;
  width: 100%;
  ${(props) => props.$hasLabel && `margin-top: var(--date-picker-input-margin-top);`}
`;

export const FloatingLabel = styled.span`
  position: absolute;
  top: var(--date-picker-floating-label-top);
  left: var(--date-picker-floating-label-left);
  background: var(--color-white);
  padding: var(--date-picker-floating-label-padding);
  font-family: var(--bs-body-font-family);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-16);
  line-height: var(--line-height-20);
  letter-spacing: var(--date-picker-floating-label-letter-spacing);
  color: var(--color-midnight);
  z-index: 1;
`;

export const DateInputIcon = styled(Calendar)`
  position: absolute;
  left: var(--spacing-16);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-midnight);
  cursor: pointer;
  z-index: 1;
`;

export const DateInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: var(--spacing-16);
  padding-left: var(--date-picker-input-padding-left);
  border: var(--border-width-thin) solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-24);
  letter-spacing: var(--date-picker-input-letter-spacing);
  font-weight: var(--font-weight-regular);
  color: var(--color-midnight);
  font-family: var(--bs-body-font-family);
  cursor: text;
  background: var(--color-white);
  border: ${(props) =>
    props.$hasError ? "2px solid var(--color-red-600)" : "var(--border-width-thin) solid var(--color-grey-200)"};

  &:focus {
    outline: none;
    border-color: var(--color-midnight);
  }

  &:hover {
    border-color: var(--color-grey-400);
  }
`;

export const DatePickerPopover = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: var(--date-picker-popover-z-index);
  background: var(--color-white);
  border: var(--border-width-thin) solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  box-shadow: var(--communication-tracker-dialog-box-shadow);
  padding: var(--spacing-16);
`;
