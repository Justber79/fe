import styled from "styled-components";

export const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: var(--color-white);
  padding: var(--volunteer-profile-opportunities-accordion-container-padding);
  border-radius: var(--volunteer-profile-opportunities-accordion-container-border-radius);
  border: var(--volunteer-profile-opportunities-accordion-container-border);
  gap: var(--volunteer-profile-opportunities-accordion-container-gap);
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const HeaderInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--volunteer-profile-opportunities-accordion-header-info-gap);
`;

export const HeaderInfoAvatarNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--volunteer-profile-opportunities-accordion-header-avatar-name-gap);
  align-self: stretch;
`;

export const HeaderButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--volunteer-profile-opportunities-accordion-header-buttons-gap);
`;

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--volunteer-profile-opportunities-accordion-container-gap);
`;

export const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--volunteer-profile-opportunities-accordion-split-container-gap);

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--volunteer-profile-opportunities-accordion-detail-section-gap);
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--volunteer-profile-opportunities-accordion-detail-header-gap);
`;

export const Actions = styled.div`
  display: flex;
  gap: var(--volunteer-profile-opportunities-accordion-actions-container-gap);
  justify-content: center;
`;
