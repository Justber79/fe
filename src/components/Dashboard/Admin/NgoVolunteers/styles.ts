import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
  max-width: 640px;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
`;

export const InputWrapper = styled.div`
  flex: 1;
  min-width: 0;
  --form-input-container-height: var(--button-height);
  --form-input-container-border-radius: var(--button-border-radius);
  --form-input-container-padding: 0 var(--spacing-24);
  --form-input-container-border: 1px solid var(--color-grey-200);
  --form-input-container-border-focus: 2px solid var(--color-green-200);
  --form-input-fontSize: var(--text-p-font-size);
`;
