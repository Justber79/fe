import styled from "styled-components";
import Button from "@/components/core/button/Button/Button";

export const Review = styled.div`
  --translation-action-height: 56px;
  --translation-action-font-size: var(--font-size-lg);
  --translation-action-padding: var(--spacing-12) var(--spacing-24);
  width: 100%;
  min-width: 0;
  color: var(--color-midnight);
  @media (max-width: 767px) {
    --translation-action-height: var(--spacing-48);
    --translation-action-font-size: var(--font-size-md);
    --translation-action-padding: 10px var(--spacing-16);
  }
`;
export const Summary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-24);
  padding-top: var(--spacing-16);
  > div {
    min-width: 0;
  }
  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
export const ReviewButton = styled(Button).attrs({
  backgroundcolor: "var(--color-white)",
  border: "var(--border-width-medium) solid var(--color-aubergine)",
  width: "auto",
  height: "auto",
  padding: "10px var(--spacing-24)",
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-12);
  min-height: var(--translation-action-height);
  color: var(--color-aubergine);
  font: inherit;
  font-size: var(--translation-action-font-size);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-24);
  text-align: center;
  flex-shrink: 0;
  max-width: 100%;
  svg {
    flex-shrink: 0;
  }
  @media (max-width: 767px) {
    padding: var(--spacing-8) var(--spacing-16);
  }
`;
export const Expanded = styled.div`
  border-top: 1px solid var(--color-grey-200);
  margin-top: var(--spacing-24);
  padding-top: var(--spacing-16);
`;
export const Comparison = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-32);
  margin-top: var(--spacing-24);
  > section {
    min-width: 0;
    overflow-wrap: anywhere;
  }
  > section:first-child {
    border-right: 1px solid var(--color-grey-200);
    padding-right: var(--spacing-32);
  }
  @media (max-width: 1000px) {
    grid-template-columns: minmax(0, 1fr);
    > section:first-child {
      border-right: 0;
      border-bottom: 1px solid var(--color-grey-200);
      padding: 0 0 var(--spacing-24);
    }
  }
`;
export const Field = styled.div`
  margin-top: var(--spacing-24);
  textarea {
    padding: var(--editableField-fieldWrapper-input-padding);
    border: var(--editableField-fieldWrapper-input-border);
    font: inherit;

    &:focus {
      border: var(--editableField-border-focus);
    }

    &[aria-invalid="true"] {
      border: var(--editableField-border-error);
    }
  }
  p {
    white-space: pre-wrap;
    margin: var(--spacing-8) 0;
  }
  h4,
  label {
    display: block;
    font-size: var(--font-size-lg);
    line-height: 28px;
    font-weight: var(--font-weight-bold);
    margin: 0 0 var(--spacing-8);
  }
`;
export const Metadata = styled.p`
  font-size: var(--font-size-sm);
  line-height: var(--line-height-24);
  margin: var(--spacing-8) 0;
`;
export const Status = styled.span<{ $attention?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-8);
  padding: 6px var(--spacing-12);
  border-radius: var(--spacing-8);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-20);
  color: var(--color-midnight);
  background: ${({ $attention }) => ($attention ? "var(--color-orchid-light)" : "var(--color-orchid-subtle)")};
`;
export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--spacing-16);
  margin-top: var(--spacing-24);
  > button {
    max-width: 100%;
    white-space: normal;
    min-height: var(--translation-action-height);
    height: auto;
  }
  @media (max-width: 767px) {
    justify-content: flex-start;
  }
`;
export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-16);
  border-top: 1px solid var(--color-grey-200);
  margin-top: var(--spacing-24);
  padding-top: var(--spacing-16);
`;
