import styled from "styled-components";
import { Heading3 } from "@/components/styled/text";

export const DialogTitle = styled(Heading3)`
  margin-bottom: 16px;
`;

export const ConflictBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  margin-top: var(--spacing-12);
  padding: var(--spacing-12);
  border-radius: var(--border-radius-xs);
  background: var(--color-orchid-subtle);
  color: var(--color-midnight);

  a {
    color: var(--color-aubergine);
    font-weight: var(--font-weight-semibold);
    text-decoration: underline;
  }
`;
