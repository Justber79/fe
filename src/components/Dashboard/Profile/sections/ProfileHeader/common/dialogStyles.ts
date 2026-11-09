import styled from "styled-components";

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
  padding: 0;
  height: 100%;
`;

export const ModalTitle = styled.h3`
  font-size: var(--dialog-title-font-size);
  font-weight: var(--font-weight-bold);
  line-height: var(--dialog-title-line-height);
  letter-spacing: var(--dialog-title-letter-spacing);
  color: var(--color-blue-700);
  margin: 0;
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
`;

export const OptionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
`;

export const RadioOption = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-8);
  cursor: pointer;

  input[type="radio"] {
    appearance: none;
    width: var(--icon-size-24);
    height: var(--icon-size-24);
    border: var(--border-width-medium) solid var(--color-grey-400);
    border-radius: var(--percent-50);
    cursor: pointer;
    position: relative;
    flex-shrink: 0;

    &:checked {
      background-color: var(--color-green-200);
      border-color: var(--color-green-200);

      &::after {
        content: "";
        position: absolute;
        width: var(--dialog-checkmark-width);
        height: var(--dialog-checkmark-height);
        border: solid var(--color-blue-700);
        border-width: var(--dialog-checkmark-border-width);
        border-radius: var(--dialog-checkmark-border-radius);
        background-color: transparent;
        top: var(--percent-50);
        left: var(--percent-50);
        transform: var(--dialog-checkmark-transform);
      }
    }
  }
`;

export const OptionLabel = styled.span`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-24);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blue-700);
  flex: 1;
`;

export const OptionDescription = styled.p`
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-20);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-grey-700);
  margin: 0;
`;

export const DateFieldContainer = styled.div`
  margin-top: var(--spacing-8);
`;

export const DialogSearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-8) var(--spacing-12);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--spacing-8);
  font: inherit;
  color: var(--color-midnight);
`;
