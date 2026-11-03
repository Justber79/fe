import styled from "styled-components";

export const AvatarImg = styled.img`
  width: var(--opportunity-volunteers-avatar-size);
  height: var(--opportunity-volunteers-avatar-size);
  border-radius: var(--opportunity-volunteers-avatar-border-radius);
  object-fit: cover;
  flex-shrink: 0;
`;

export const OpportunityVolunteersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--volunteer-profile-opportunities-container-gap);
`;

export const OpportunityVolunteersList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: var(--profile-opportunities-container-height);
  overflow-y: auto;
  gap: var(--volunteer-profile-opportunities-container-gap);
`;

export const DetailParagraph = styled.p`
  font-weight: var(--volunteer-profile-opportunities-accordion-opp-detail-light-font);
  color: var(--color-midnight);
  margin: 0;
`;
