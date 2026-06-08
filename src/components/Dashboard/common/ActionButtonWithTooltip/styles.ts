import styled from "styled-components";

export const ActionButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--document-section-action-button-size);
  height: var(--document-section-action-button-size);
  border: none;
  background: transparent;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  padding: 0;
  color: ${(props) => (props.$disabled ? "var(--color-grey-200)" : "var(--color-midnight)")};

  &:hover:not(:disabled) {
    opacity: var(--document-section-action-button-hover-opacity);
  }
`;
