import styled from "styled-components";
import { TableContainer } from "@/components/core/common/Table";
import { FlexColumn } from "@/components/styled/FlexColumn";

export const ActivityLogTableContainer = styled(TableContainer)`
  margin-top: var(--spacing-24);
`;

export const TotalRow = styled.div`
  display: flex;
  flex-direction: row;
  background: var(--color-pink-50);
  border-top: var(--border-width-thin) solid var(--color-blue-50);
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
`;

export const TotalCell = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-16);
  flex: 1;
`;

export const TotalSpacer = styled.div`
  width: var(--communication-tracker-action-column-width);
`;

export const AddEntryRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`;

export const AddEntryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-8);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--spacing-8) 0;
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  color: var(--color-aubergine);

  &:hover {
    opacity: var(--opacity-hover);
  }
`;

export const DialogTitle = styled.h3`
  font-weight: var(--font-weight-bold);
  font-size: var(--dialog-title-font-size);
  line-height: var(--dialog-title-line-height);
  letter-spacing: var(--dialog-title-letter-spacing);
  color: var(--color-midnight);
  margin: 0 0 var(--spacing-24) 0;
`;

export const FieldGroup = styled(FlexColumn).attrs({
  $gap: "var(--spacing-8)",
  $width: "100%",
  $alignItems: "flex-start",
})``;

export const FieldLabel = styled.label`
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  color: var(--color-midnight);
`;

export const HoursInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: var(--spacing-16);
  border: var(--border-width-thin) solid
    ${(props) => (props.$hasError ? "var(--form-input-error-message-color)" : "var(--color-grey-200)")};
  border-radius: var(--border-radius-small);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-24);
  font-weight: var(--font-weight-regular);
  color: var(--color-midnight);
  font-family: var(--bs-body-font-family);
  background: var(--color-white);

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "var(--form-input-error-message-color)" : "var(--color-midnight)")};
  }

  &:hover {
    border-color: ${(props) => (props.$hasError ? "var(--form-input-error-message-color)" : "var(--color-grey-400)")};
  }
`;

export const FieldError = styled.span`
  font-size: var(--form-input-error-message-fontSize);
  font-weight: var(--form-input-error-message-fontWeight);
  line-height: var(--form-input-error-message-lineHeight);
  color: var(--form-input-error-message-color);
`;
