import styled from "styled-components";

export const NewPostSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  flex-shrink: 0;
`;

export const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
  height: max(
    520px,
    calc(
      100dvh - var(--layout-static-page-header-height) - var(--dashboard-base-container-padding-top) - var(
          --dashboard-base-container-padding-bottom
        )
    )
  );

  @media (max-width: 767px) {
    height: max(
      520px,
      calc(
        100dvh - var(--layout-static-page-header-height) - var(--dashboard-base-container-padding-top) - var(
            --dashboard-base-container-padding-bottom
          ) - var(--dashboard-navigation-bar-mobile-height)
      )
    );
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-8);
  padding: var(--spacing-16);
  height: 320px;
`;

export const FeedScrollContainer = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  gap: var(--spacing-12);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0 var(--spacing-8) var(--spacing-8);
`;

export const LoadOlderIndicator = styled.div`
  display: flex;
  min-height: var(--spacing-24);
  align-items: center;
  justify-content: center;
  color: var(--color-midnight);
`;

export const FeedPost = styled.article`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  padding: var(--spacing-16);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--card-border-radius);
  background-color: var(--color-white);
`;

export const PostHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-8);
`;

export const PostAuthor = styled.strong`
  color: var(--color-midnight);
`;

export const PostTimestamp = styled.time`
  color: var(--color-grey-500);
  font-size: var(--font-size-sm);
`;

export const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: var(--spacing-8);
`;
