import styled from "styled-components";

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
`;

export const FieldLabel = styled.label`
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-midnight);
`;

export const StyledInput = styled.input`
  width: 100%;
  border: var(--border-width-thin) solid var(--color-grey-400);
  border-radius: var(--border-radius-small);
  padding: var(--spacing-12) var(--spacing-16);
  font-size: var(--font-size-sm);
  color: var(--color-midnight);
  background: var(--color-white);
  box-sizing: border-box;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: var(--color-midnight);
  }

  &::placeholder {
    color: var(--color-grey-400);
  }

  &[type="date"],
  &[type="time"] {
    cursor: pointer;
  }
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  border: var(--border-width-thin) solid var(--color-grey-400);
  border-radius: var(--border-radius-small);
  padding: var(--spacing-12) var(--spacing-16);
  font-size: var(--font-size-sm);
  color: var(--color-midnight);
  background: var(--color-white);
  resize: vertical;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    border-color: var(--color-midnight);
  }

  &::placeholder {
    color: var(--color-grey-400);
  }
`;

export const HelperText = styled.p`
  font-size: var(--font-size-xs);
  color: var(--color-grey-500);
  margin: 0;
`;

export const CharCount = styled.p`
  font-size: var(--font-size-xs);
  color: var(--color-grey-500);
  text-align: right;
  margin: 0;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-16);
  margin-top: var(--spacing-8);
`;

export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-24);
  padding: var(--spacing-16) 0;
  border-bottom: var(--border-width-thin) solid var(--color-grey-200);

  &:last-child {
    border-bottom: none;
  }
`;

export const FieldRowLabel = styled.span`
  font-size: var(--font-size-md);
  font-weight: bold;
  color: var(--color-midnight);
  min-width: var(--create-event-field-label-min-width);
`;
