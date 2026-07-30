import styled from "styled-components";

interface MatchBannerProps {
  $matched: boolean;
}

export const MatchBanner = styled.div<MatchBannerProps>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 8px;
  font-size: 0.9375rem;
  background: ${({ $matched }) =>
    $matched ? "var(--color-success-light, #f0fdf4)" : "var(--color-orchid-light, #faf5ff)"};
  border: 1px solid ${({ $matched }) => ($matched ? "var(--color-success-border, #bbf7d0)" : "var(--color-grey-200)")};
  color: var(--color-midnight);
`;

// Plain descriptive copy above the match list — must not read as a CTA the
// way MatchBanner's colored/bordered box does; the row below is the CTA.
export const MatchListCopy = styled.p`
  font-size: 0.9375rem;
  color: var(--color-grey-500);
  margin: 8px 0 4px;
`;

export const CheckMark = styled.span`
  font-size: 1.25rem;
  color: var(--color-success, #16a34a);
  flex-shrink: 0;
`;

// A single candidate in the address-match picker: the whole row is the
// call-to-action (click to select), not a row + separate button.
export const MatchRow = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 6px;
  font-size: 0.9375rem;
  cursor: pointer;
  background: var(--color-white);
  border: 1px solid var(--color-grey-200);
  color: var(--color-midnight);

  &:hover {
    background: var(--color-orchid-light, #faf5ff);
    border-color: var(--color-aubergine);
  }
`;

export const MatchActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

interface SmallButtonProps {
  $primary?: boolean;
}

export const SmallButton = styled.button<SmallButtonProps>`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ $primary }) => ($primary ? "var(--color-aubergine)" : "var(--color-grey-300)")};
  background: ${({ $primary }) => ($primary ? "var(--color-aubergine)" : "var(--color-white)")};
  color: ${({ $primary }) => ($primary ? "var(--color-white)" : "var(--color-midnight)")};

  &:hover {
    opacity: 0.85;
  }
`;
