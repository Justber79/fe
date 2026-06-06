import styled from "styled-components";

import { BaseCard } from "@/components/styled/container";

export const OpportunitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-volunteers-container-gap);
`;

export const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--dashboard-volunteers-container-gap);

  /* Let the filters panel wrap to its own full-width row on narrow viewports (#534). */
  @media (max-width: 1023px) {
    flex-wrap: wrap;
  }
`;

export const OpportunityCardListContainer = styled.div`
  display: flex;
  justify-content: left;
`;

export const Card = styled(BaseCard)`
  background-color: var(--color-orchid-subtle);
  width: var(--dashboard-volunteers-card-width);
  min-height: var(--dashboard-volunteers-card-height);
  gap: var(--dashboard-volunteers-card-gap);
  padding: var(--dashboard-volunteers-card-padding);
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: var(--color-orchid);
  }
`;

export const StatusTagsDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--dashboard-volunteers-card-status-tags-div-gap);
  margin-top: var(--dashboard-volunteers-card-status-tags-div-margin-top);
`;

export const StatusDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: var(--color-white);
  height: var(--dashboard-volunteers-card-status-div-height);
  border-bottom-left-radius: var(--dashboard-volunteers-card-status-div-bordor-bottom);
  border-bottom-right-radius: var(--dashboard-volunteers-card-status-div-bordor-bottom);
  gap: var(--dashboard-volunteers-card-status-div-gap);
  padding: var(--dashboard-volunteers-card-status-div-padding);
`;

export const TagDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: var(--color-green-200);
  height: var(--dashboard-volunteers-card-status-div-height);
  border-bottom-left-radius: var(--dashboard-volunteers-card-status-div-bordor-bottom);
  border-bottom-right-radius: var(--dashboard-volunteers-card-status-div-bordor-bottom);
  padding: var(--dashboard-volunteers-card-tag-div-padding);
  gap: var(--dashboard-volunteers-card-tag-div-gap);
`;

export const TitleParagraph = styled.p`
  font-weight: var(--dashboard-volunteers-card-profile-fontWeight);
  font-size: var(--dashboard-volunteers-card-profile-fontSize);
  line-height: var(--dashboard-volunteers-card-profile-lineHeight);
  margin: 0;
`;

export const LanguageRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--dashboard-volunteers-card-detail-gap);
`;
