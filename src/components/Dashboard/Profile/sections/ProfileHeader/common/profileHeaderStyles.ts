import styled from "styled-components";

export const Card = styled.div`
  background: var(--color-white);
  border-radius: var(--volunteer-profile-section-card-border-radius);
  padding: var(--volunteer-profile-section-card-padding);
`;

export const ProfileContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--spacing-24);
  align-items: center;

  @media (max-width: 767px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const AvatarContainer = styled.div`
  position: relative;
  height: 280px;
  width: 280px;
  border-radius: var(--percent-50);
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: 767px) {
    height: min(220px, calc(100vw - 64px));
    width: min(220px, calc(100vw - 64px));
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 280px;
  width: 280px;
  border-radius: var(--percent-50);
  background-color: var(--color-blue-50);
  flex-shrink: 0;

  @media (max-width: 767px) {
    height: min(220px, calc(100vw - 64px));
    width: min(220px, calc(100vw - 64px));
  }
`;

export const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
  min-width: 0;
  width: 100%;
`;

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
`;

export const Title = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--space-xl);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blue-700);
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-regular);
  line-height: var(--space-lg);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blue-700);
  margin: 0;
`;

export const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0;
`;

export const EditButton = styled.button`
  background: transparent;
  color: var(--color-midnight-bright);
  border: none;
  padding: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--space-lg);
  letter-spacing: var(--letter-spacing-tight);
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition-all);
  flex-shrink: 0;

  &:hover {
    color: var(--color-blue-700);
    opacity: var(--opacity-hover);
  }

  &:disabled {
    color: var(--color-gray-400);
    cursor: not-allowed;
    opacity: 0.5;

    &:hover {
      color: var(--color-gray-400);
      opacity: 0.5;
    }
  }
`;

export const ReturnDateText = styled.span`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-base);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blue-700);
`;

export const IconWrapper = styled.span`
  width: var(--status-badge-icon-size);
  height: var(--status-badge-icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
`;
