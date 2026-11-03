import Link from "next/link";
import styled from "styled-components";
import { screenSizeThresholds } from "@/config/constants";
import { StyledForm } from "../styles";

export const LoginFormLayout = styled(StyledForm)`
  gap: var(--spacing-24);
`;

export const LoginPage = styled.main`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: var(--space-3xl);
  width: 100%;
  max-width: 1344px;
  min-height: calc(100dvh - var(--layout-static-page-header-height));
  margin-inline: auto;
  padding: var(--spacing-48) var(--spacing-24);

  @media (max-width: ${screenSizeThresholds.tablet - 1}px) {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--spacing-32);
    min-height: 0;
    padding: var(--space-3xl) var(--spacing-20) var(--spacing-40);
    max-width: 600px;
  }
`;

export const LoginSection = styled.section`
  min-width: 0;
`;

export const LoginHeading = styled.h1`
  margin: 0 0 var(--spacing-40);
  color: var(--color-midnight);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: 1.15;

  @media (max-width: ${screenSizeThresholds.tablet - 1}px) {
    text-align: center;
    margin-bottom: var(--spacing-32);
  }
`;

export const RegistrationSection = styled.section`
  min-width: 0;
`;

export const Illustration = styled.div`
  max-width: 520px;
  margin: 0 auto var(--spacing-32);

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  @media (max-width: ${screenSizeThresholds.tablet - 1}px) {
    display: none;
  }
`;

export const RegistrationHeading = styled.h2`
  color: var(--color-midnight);
  font-size: clamp(var(--font-size-2xl), 3.2vw, var(--font-size-3xl));
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  margin: 0 0 var(--spacing-24);

  @media (max-width: ${screenSizeThresholds.tablet - 1}px) {
    display: flex;
    align-items: center;
    gap: var(--spacing-16);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-24);
    text-align: center;

    &::before,
    &::after {
      content: "";
      flex: 1;
      border-top: var(--border-width-thin) solid var(--color-orchid);
    }
  }
`;

export const RegistrationLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);

  @media (max-width: ${screenSizeThresholds.tablet - 1}px) {
    gap: var(--spacing-16);
  }
`;

export const RegistrationLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-16);
  min-height: var(--button-height);
  padding-block: var(--spacing-16);
  border-bottom: var(--border-width-thin) solid var(--color-orchid);
  color: var(--color-aubergine);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-32);
  text-decoration: none;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    color: var(--color-aubergine-light);
  }

  &:focus-visible {
    outline: var(--border-width-medium) solid var(--color-midnight);
    outline-offset: var(--spacing-4);
  }

  @media (max-width: ${screenSizeThresholds.tablet - 1}px) {
    justify-content: center;
    border: var(--border-width-medium) solid var(--color-aubergine);
    border-radius: var(--button-border-radius);
    padding: var(--spacing-12) var(--spacing-24);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-24);
    text-align: center;

    svg {
      display: none;
    }
  }
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

  @media (min-width: ${screenSizeThresholds.tablet}px) {
    margin-top: var(--spacing-8);

    > button {
      min-width: 180px;
    }
  }

  @media (max-width: ${screenSizeThresholds.tablet - 1}px) {
    > button {
      width: 100%;
    }
  }
`;
