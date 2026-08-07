import Link from "next/link";
import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: var(--volunteer-profile-container-width);
  gap: var(--volunteer-profile-container-gap);
`;

export const PageContentContainer = styled.div<{ $isFading?: boolean; $fadeDuration?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: var(--volunteer-profile-container-width);
  gap: var(--volunteer-profile-container-gap);
  opacity: ${({ $isFading }) => ($isFading ? 0 : 1)};
  transition: opacity ${({ $fadeDuration }) => $fadeDuration}ms ease-in-out;
`;

const backNavStyles = `
  display: inline-flex;
  align-items: center;
  gap: var(--volunteer-profile-back-link-gap);
  font-size: var(--volunteer-profile-back-link-font-size);
  color: var(--color-midnight);
  text-decoration: none;
  transition: var(--volunteer-profile-back-link-transition);
`;

export const BackLink = styled(Link)`
  ${backNavStyles}
`;

export const BackButton = styled.button`
  ${backNavStyles}
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

export const ProfileNavigatorWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  font-size: var(--profile-navigation-container-font-size);
`;

export const ProfileNavigatorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--profile-navigation-container-gap);
  cursor: pointer;
`;
