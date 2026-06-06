import styled from "styled-components";

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: var(--dashboard-home-container-padding);
  gap: var(--dashboard-home-container-gap);
`;

export const DashboardContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-home-container-gap);
  min-height: var(--dashboard-home-container-min-height);
`;

export const DashboardCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--dashboard-home-container-gap);
`;
