import React from "react";
import styled from "styled-components";

type Props = {
  bg: string;
  textColor: string;
  icon?: React.ReactNode;
  "data-testid"?: string;
  children: React.ReactNode;
};

const StyledTag = styled.div<{
  $bg: string;
  $textColor: string;
}>`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-12);
  border-radius: var(--border-radius-xs);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-24);
  letter-spacing: var(--letter-spacing-tight);
  width: fit-content;
  max-width: 100%;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $textColor }) => $textColor};

  [data-tag-icon] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--status-badge-icon-size);
    height: var(--status-badge-icon-size);
  }

  [data-tag-label] {
    overflow-wrap: anywhere;
  }
`;

export const StatusTag = ({ bg, textColor, icon, children, ...props }: Props) => (
  <StyledTag $bg={bg} $textColor={textColor} {...props}>
    {icon && <span data-tag-icon>{icon}</span>}
    <span data-tag-label>{children}</span>
  </StyledTag>
);
