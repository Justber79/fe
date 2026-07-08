import styled from "styled-components";

export const NewPostSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

export const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-8);
  padding: var(--spacing-16);
  height: 320px;
`;

export const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: var(--spacing-8);
`;
