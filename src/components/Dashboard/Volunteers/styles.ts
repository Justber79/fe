import { BaseCard } from "@/components/styled/container";
import styled from "styled-components";

export const Card = styled(BaseCard)<{ $cursor?: string }>`
  background-color: var(--color-orchid-subtle);
  width: var(--dashboard-volunteers-card-width);
  height: var(--dashboard-volunteers-card-height);
  gap: var(--dashboard-volunteers-card-gap);
  padding: var(--dashboard-volunteers-card-padding);
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  cursor: ${(props) => props.$cursor || "pointer"};

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

export const ProfileDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--dashboard-volunteers-card-profile-div-gap);
`;

export const LanguageDetailContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--dashboard-volunteers-card-detail-gap);
`;
