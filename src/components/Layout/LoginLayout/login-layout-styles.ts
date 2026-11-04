import Link from "next/link";
import styled from "styled-components";
import { loginLayoutStackingMedia } from "@/components/styled/mixins";

export const LoginPage = styled.main`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: var(--space-3xl);
  width: 100%;
  max-width: 1344px;
  flex: 1;
  margin-inline: auto;
  padding: var(--spacing-48) var(--spacing-24);

  @media ${loginLayoutStackingMedia} {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--spacing-32);
    min-height: 0;
    padding: var(--space-3xl) var(--spacing-20) var(--spacing-40);
    max-width: 600px;
  }
`;

export const LoginSection = styled.section`
  min-width: 0;
  width: 100%;
  max-width: var(--dashboard-login-content-container-width);
  justify-self: center;
`;

export const LoginHeading = styled.h1<{ $compact?: boolean }>`
  margin: 0 0 var(--spacing-40);
  color: var(--color-midnight);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: 1.15;

  @media ${loginLayoutStackingMedia} {
    font-size: ${({ $compact }) => ($compact ? "var(--font-size-2xl)" : "var(--font-size-3xl)")};
    text-align: center;
    margin-bottom: var(--spacing-32);
  }
`;

export const RegistrationSection = styled.section<{ $illustrationOnly?: boolean }>`
  min-width: 0;

  @media ${loginLayoutStackingMedia} {
    display: ${({ $illustrationOnly }) => ($illustrationOnly ? "none" : "block")};
  }
`;

export const Illustration = styled.div`
  max-width: 520px;
  margin: 0 auto var(--spacing-32);

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  @media ${loginLayoutStackingMedia} {
    display: none;
  }
`;

export const RegistrationHeading = styled.h2`
  color: var(--color-midnight);
  font-size: clamp(var(--font-size-2xl), 3.2vw, var(--font-size-3xl));
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  margin: 0 0 var(--spacing-24);

  @media ${loginLayoutStackingMedia} {
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

  @media ${loginLayoutStackingMedia} {
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

  @media ${loginLayoutStackingMedia} {
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
