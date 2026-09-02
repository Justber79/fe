import styled from "styled-components";

export const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 16px;
  background: var(--layout-static-page-background-default, #f8f6f8);
`;

export const Card = styled.div`
  background: var(--color-white);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
`;

// Wrapper's own min-height: 100vh would double up with PageLayout's flex: 1
// container (which already fills the viewport minus header/footer), adding
// a spurious extra viewport of empty space. Used by AgentRegistration and
// VolunteerRegistration, both rendered inside PageLayout — not by
// ProfileCompletion, which isn't.
export const PageWrapper = styled(Wrapper)`
  min-height: 0;
  flex: 1;
`;

export const PageTitle = styled.h1`
  font-size: 1.625rem;
  font-weight: 700;
  color: var(--color-midnight);
  margin: 0 0 4px;
`;

export const PageSubtitle = styled.p`
  font-size: 0.9375rem;
  color: var(--color-grey-500);
  margin: 0 0 32px;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  gap: 12px;
`;

export const ErrorBanner = styled.div`
  background: var(--color-error-light, #fef2f2);
  border: 1px solid var(--color-error-border, #fecaca);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 0.9375rem;
  color: var(--color-error, #dc2626);
`;

export const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 0;
  text-align: center;
`;

export const ExistingUserWrapper = styled.div`
  display: flex;
  gap: var(--agent-form-existing-user-gap);
  margin-bottom: var(--agent-form-existing-user-margin-bottom);
`;

export const ExistingUserText = styled.span`
  font-size: var(--agent-form-existing-user-font-size);
  color: var(--color-grey-800);
`;

export const SuccessTitle = styled.h2`
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-midnight);
`;

export const SuccessText = styled.p`
  font-size: 0.9375rem;
  color: var(--color-grey-500);
`;

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

type SelectProps = {
  $hasError: boolean;
};

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

export const FieldConsent = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin-top: 4px;
    accent-color: var(--color-aubergine);
    cursor: pointer;
  }
`;

export const StyledErrorMessage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--form-input-error-message-container-gap);
  padding: var(--form-input-error-message-container-padding);
  color: var(--form-input-error-message-color);
  font-size: var(--form-input-error-message-fontSize);
  font-weight: var(--form-input-error-message-fontWeight);
  line-height: var(--form-input-error-message-lineHeight);
`;
