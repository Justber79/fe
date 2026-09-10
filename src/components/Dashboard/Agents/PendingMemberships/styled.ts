import styled from "styled-components";

export const Panel = styled.section`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--color-aubergine);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
  background: var(--color-white);
`;

export const Title = styled.h3`
  margin: 0 0 12px;
  font-size: 1rem;
  color: var(--color-midnight);
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-top: 1px solid var(--color-light-grey, #e5e5e5);

  &:first-of-type {
    border-top: none;
  }

  @media (max-width: 767px) {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }
`;

export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 2px;
  font-size: 0.875rem;
  color: var(--color-midnight);

  strong,
  span {
    overflow-wrap: anywhere;
  }

  span {
    color: var(--color-grey, #6b6b6b);
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 767px) {
    width: 100%;

    > button {
      flex: 1 1 0;
      min-width: 0;
      width: auto;
    }
  }
`;
