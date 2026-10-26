import styled from "styled-components";

export const TextArea = styled.textarea`
  display: block;
  width: 100%;
  min-width: 0;
  min-height: var(--editableField-fieldWrapper-textarea-minHeight);
  padding: var(--editableField-fieldWrapper-input-padding);
  border: var(--editableField-fieldWrapper-input-border);
  border-radius: var(--editableField-fieldWrapper-input-borderRadius);
  color: var(--color-midnight);
  background: var(--color-white);
  font: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border: var(--editableField-border-focus);
  }

  &[aria-invalid="true"] {
    border: var(--editableField-border-error);
  }
`;
