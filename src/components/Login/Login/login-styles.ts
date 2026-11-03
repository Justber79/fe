import styled from "styled-components";
import { screenSizeThresholds } from "@/config/constants";
import { StyledForm } from "../styles";

export const LoginFormLayout = styled(StyledForm)`
  gap: var(--spacing-24);
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
`;

export const FieldLabel = styled.label`
  color: var(--color-midnight);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-24);

  @media (max-width: ${screenSizeThresholds.tablet - 1}px) {
    font-size: var(--font-size-sm);
  }
`;

export const SubmitRow = styled.div`
  display: flex;
  width: fit-content;
  min-width: 180px;
  max-width: 100%;

  @media (min-width: ${screenSizeThresholds.tablet}px) {
    margin-top: var(--spacing-8);
  }

  @media (max-width: ${screenSizeThresholds.tablet - 1}px) {
    width: 100%;
    min-width: 0;
  }
`;
