import { FlexColumn } from "@/components/styled/FlexColumn";
import styled from "styled-components";
import { HasError, IsEditing } from "@/types";

export const SectionWrapper = styled(FlexColumn).attrs({
  $gap: "var(--spacing-24)",
  $width: "100%",
  $alignItems: "flex-start",
})``;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

export const SectionEmptyState = styled.div`
  width: 100%;
  padding: var(--spacing-48) var(--spacing-24);
  text-align: center;
  color: var(--color-grey-500);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
`;

export const DialogButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: var(--spacing-16);
  margin-top: auto;
  padding-top: var(--spacing-16);
`;

export const DialogForm = styled.form<{ $gap?: string }>`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
`;

export const FormContainer = styled(FlexColumn).attrs<IsEditing>((props) => ({
  $gap: props.$isEditing ? "var(--spacing-16)" : "0",
}))<IsEditing>``;

export const FormDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

export const FormButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-24);
  width: 100%;
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

export const FieldWrapper = styled.div<HasError>`
  display: var(--editableField-fieldWrapper-display);
  border-bottom: var(--editableField-fieldWrapper-borderBottom);
  padding: ${(props) =>
    props.$hasError ? "var(--editableField-fieldWrapper-padding-error)" : "var(--editableField-fieldWrapper-padding)"};
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

  > span {
    flex: 1;
  }

  input {
    border-radius: var(--editableField-fieldWrapper-input-borderRadius);
    padding: var(--editableField-fieldWrapper-input-padding);
    color: var(--color-midnight);
    border: var(--editableField-fieldWrapper-input-border);
    flex: 1;
    min-width: 0;
  }
`;
