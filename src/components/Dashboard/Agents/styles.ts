import { BaseCard } from "@/components/styled/container";
import styled from "styled-components";

export const AgentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-volunteers-container-gap);
`;

export const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--dashboard-volunteers-container-gap);

  @media (max-width: 1023px) {
    flex-wrap: wrap;
  }
`;

export const AgentCardListContainer = styled.div`
  display: flex;
  justify-content: left;
`;

export const Card = styled(BaseCard)<{ $cursor?: string }>`
  background-color: var(--color-orchid-subtle);
  width: var(--dashboard-agents-card-width);
  height: var(--dashboard-agents-card-height);
  gap: var(--dashboard-agents-card-gap);
  padding: var(--dashboard-agents-card-padding);
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  cursor: ${(props) => props.$cursor || "pointer"};

  text-decoration: none;
  color: inherit;

  &:hover {
    background-color: var(--color-orchid);
  }
`;

export const DistrictContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-agents-card-status-tags-div-gap);
  margin-top: var(--dashboard-agents-card-status-tags-div-margin-top);
`;

export const DistrictDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  gap: var(--dashboard-agents-card-status-tags-div-gap);
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  height: var(--agent-profile-section-card-header-height);
`;

export const CardHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--agent-profile-section-card-header-info-gap);
`;

export const CardDetailsInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--agent-profile-section-card-info-gap);
`;
