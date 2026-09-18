import styled from "styled-components";
import { Paragraph } from "./text";

// Shared between EventPage and EventPageOne (two independent public event
// pages, see fe#1022) so their common card/hero/body layout stays in sync.
export const PageContent = styled.main`
  width: min(100% - 32px, 960px);
  margin: 0 auto;
  padding: clamp(40px, 7vw, 88px) 0;
`;

export const EventCard = styled.article`
  overflow: hidden;
  border: 1px solid var(--color-orchid-light, var(--color-orchid));
  border-radius: 24px;
  background: var(--color-white);
  box-shadow: 0 16px 40px rgb(40 25 47 / 10%);
`;

export const Hero = styled.header`
  padding: clamp(28px, 6vw, 64px);
  background: linear-gradient(135deg, var(--color-orchid-subtle), var(--color-orchid));
`;

export const Body = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);
  gap: clamp(32px, 6vw, 72px);
  padding: clamp(28px, 6vw, 64px);

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

export const Description = styled(Paragraph)`
  margin-top: var(--spacing-20);
  white-space: pre-line;
`;

export const Details = styled.aside`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-20);
`;

export const Detail = styled.div`
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: var(--spacing-12);
  align-items: start;
  color: var(--color-midnight);
`;
