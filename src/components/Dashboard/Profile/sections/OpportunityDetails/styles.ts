import { HasError } from "@/types";
import { opportunityFieldStackingMedia, opportunityResponsiveFieldStyles } from "@/components/styled/mixins";
import styled from "styled-components";

export const FieldRow = styled.div`
  display: var(--editableField-fieldWrapper-display);
  border-bottom: var(--editableField-fieldWrapper-borderBottom);
  padding: var(--editableField-fieldWrapper-padding);
  color: var(--color-midnight);
  width: var(--editableField-fieldWrapper-width);
  align-items: var(--editableField-fieldWrapper-alignItems);
  font-size: var(--editableField-fieldWrapper-fontSize);
  gap: var(--editableField-fieldWrapper-gap);

  > label {
    font-weight: var(--editableField-fieldWrapper-label-fontWeight);
    font-size: var(--editableField-fieldWrapper-label-fontSize);
    width: var(--editableField-fieldWrapper-label-width);
    flex-shrink: var(--editableField-fieldWrapper-label-flexShrink);
  }

  ${opportunityResponsiveFieldStyles}
`;

export const TagsValue = styled.div`
  min-width: 0;
  @media ${opportunityFieldStackingMedia} {
    width: 100%;
  }
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
`;

export const FieldGroup = styled(FieldRow)`
  align-items: flex-start;

  > label {
    padding-top: var(--spacing-8);
    @media ${opportunityFieldStackingMedia} {
      padding-top: 0;
    }
  }

  > div {
    width: 100%;
    flex: 1;
    min-width: 0;
  }
`;

export const DateFieldRow = FieldRow;

export const DatePickerContainer = styled.div`
  flex: 1;
  @media ${opportunityFieldStackingMedia} {
    width: 100%;
  }
`;

export const TimeInputWrapper = styled.div`
  flex: 1;
  @media ${opportunityFieldStackingMedia} {
    width: 100%;
  }
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

export const ErrorText = styled.span`
  color: var(--color-red-600);
  font-size: var(--font-size-14);
  margin-top: var(--spacing-4);
`;
