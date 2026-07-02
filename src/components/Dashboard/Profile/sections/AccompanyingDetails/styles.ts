import styled from "styled-components";
import { HasError, IsEditing } from "@/types";

export const NotAccompanyingMessage = styled.p`
  color: var(--color-grey-500);
  font-size: var(--font-size-16);
  line-height: 1.5;
  margin: 0;
`;

export const Container = styled.div<IsEditing>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$isEditing ? "var(--spacing-16)" : "0")};
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-24);
  width: 100%;
`;

export const DateFieldRow = styled.div`
  display: var(--editableField-fieldWrapper-display);
  border-bottom: var(--editableField-fieldWrapper-borderBottom);
  padding: var(--editableField-fieldWrapper-padding);
  color: var(--color-midnight);
  width: var(--editableField-fieldWrapper-width);
  align-items: var(--editableField-fieldWrapper-alignItems);
  font-size: var(--editableField-fieldWrapper-fontSize);
  gap: var(--editableField-fieldWrapper-gap);

  label {
    font-weight: var(--editableField-fieldWrapper-label-fontWeight);
    font-size: var(--editableField-fieldWrapper-label-fontSize);
    width: var(--editableField-fieldWrapper-label-width);
    flex-shrink: var(--editableField-fieldWrapper-label-flexShrink);
  }
`;

export const DatePickerContainer = styled.div`
  flex: 1;
`;

export const TimeInputWrapper = styled.div`
  flex: 1;
`;

export const TimeInput = styled.input<HasError>`
  width: 100%;
  border-radius: var(--editableField-fieldWrapper-input-borderRadius);
  padding: var(--editableField-fieldWrapper-input-padding);
  color: var(--color-midnight);
  border: ${(props) =>
    props.$hasError ? "2px solid var(--color-red-600)" : "var(--editableField-fieldWrapper-input-border)"};

  &:focus {
    outline: none;
    border: ${(props) => (props.$hasError ? "2px solid var(--color-red-600)" : "2px solid var(--color-green-200)")};
  }
`;
