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
  display: flex;
  flex-direction: column;
  gap: 0;
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

export const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-midnight);
  margin: 24px 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-grey-100);
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

export const FieldLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-midnight);
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

export const AgentInfo = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--color-grey-50, #f9fafb);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

export const AgentRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const AgentLabel = styled.dt`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-grey-500);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const AgentValue = styled.dd`
  font-size: 0.9375rem;
  color: var(--color-midnight);
  margin: 0;
`;

export const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const VolunteerTypeRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-16) 0;
  border-bottom: var(--border-width-thin) solid var(--color-blue-50);

  h4 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-blue-700);
    margin: 0;
    flex-shrink: 0;
  }
`;

export const TypeButtons = styled.div`
  display: flex;
  gap: var(--spacing-8);
  flex-wrap: wrap;
`;

export const TypeButton = styled.button<{ $active: boolean }>`
  padding: var(--spacing-8) var(--spacing-16);
  border-radius: var(--border-radius-sm);
  border: 2px solid var(--color-aubergine);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: var(--transition-all);
  background-color: ${({ $active }) => ($active ? "var(--color-aubergine)" : "var(--color-white)")};
  color: ${({ $active }) => ($active ? "var(--color-white)" : "var(--color-aubergine)")};

  &:hover {
    opacity: var(--opacity-hover);
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  padding: var(--spacing-16) 0;
  border-bottom: var(--border-width-thin) solid var(--color-grey-100);
  width: 100%;

  > label {
    font-size: var(--editableField-fieldWrapper-label-fontSize);
    font-weight: var(--editableField-fieldWrapper-label-fontWeight);
  }
`;

export const DateFieldRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: var(--spacing-16) 0;
  border-bottom: var(--border-width-thin) solid var(--color-grey-100);
  gap: var(--spacing-16);
  width: 100%;

  > label {
    font-size: var(--editableField-fieldWrapper-label-fontSize);
    font-weight: var(--editableField-fieldWrapper-label-fontWeight);
    flex-shrink: 0;
    width: var(--editableField-fieldWrapper-label-width);
  }
`;

export const DatePickerContainer = styled.div`
  flex: 1;
`;

export const TimeInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

export const TimeInput = styled.input<{ $hasError?: boolean }>`
  padding: var(--spacing-8) var(--spacing-12);
  border: ${({ $hasError }) => ($hasError ? "1px solid var(--color-error)" : "1px solid var(--color-grey-300)")};
  border-radius: var(--border-radius-xs);
  font-size: var(--font-size-lg);
  color: var(--color-midnight);
`;
