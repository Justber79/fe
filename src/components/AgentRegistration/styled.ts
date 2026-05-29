import styled from "styled-components";

export const StepTitle = styled.h2`
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-midnight);
  margin: 0 0 8px;
`;

export const StepDescription = styled.p`
  font-size: 0.9375rem;
  color: var(--color-grey-500);
  margin: 0 0 28px;
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
`;

export const FieldLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-midnight);
`;

interface SelectProps {
  $hasError: boolean;
}

export const StyledSelect = styled.select<SelectProps>`
  color: var(--color-midnight);
  font-size: var(--form-input-fontSize, 1rem);
  height: var(--form-input-container-height, 48px);
  width: -webkit-fill-available;
  background-color: var(--color-white);
  border-radius: var(--form-input-container-border-radius, 8px);
  padding: var(--form-input-container-padding, 0 12px);
  border: ${({ $hasError }) =>
    $hasError ? "var(--form-input-container-border-error)" : "var(--form-input-container-border)"};
  cursor: pointer;

  &:focus {
    outline: none;
    border: var(--form-input-container-border-focus);
  }
`;

export const StyledTextarea = styled.textarea`
  color: var(--color-midnight);
  font-size: var(--form-input-fontSize, 1rem);
  width: -webkit-fill-available;
  background-color: var(--color-white);
  border-radius: var(--form-input-container-border-radius, 8px);
  padding: 12px;
  border: var(--form-input-container-border);
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border: var(--form-input-container-border-focus);
  }
`;
