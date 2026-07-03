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

export const TagContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-home-container-gap);
  overflow-y: scroll;
  max-height: var(--tag-row-max-height);
`;

export const TagRow = styled.div<{ $isRead: boolean }>`
  background-color: ${({ $isRead }) => ($isRead ? "var(--color-orchid-subtle)" : "var(--color-orchid)")};
  border-radius: var(--tag-row-border-radius);
  & h4 {
    margin: 0;
  }
  & a {
    display: flex;
    gap: var(--dashboard-home-container-gap);
    align-items: center;
    text-decoration: none;
    padding: var(--tag-row-padding);
  }
  &:hover {
    background-color: ${({ $isRead }) => ($isRead ? "var(--color-orchid)" : " var(--color-orchid-subtle)")};
  }
`;
