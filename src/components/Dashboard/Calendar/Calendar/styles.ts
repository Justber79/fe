import styled from "styled-components";

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(340px, 0.9fr) minmax(0, 1.25fr);
  gap: var(--spacing-32);
  align-items: start;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;
export const CalendarAside = styled.aside`
  position: sticky;
  top: var(--spacing-24);
  @media (max-width: 1000px) {
    position: static;
  }
`;
export const Agenda = styled.section`
  min-width: 0;
`;
export const SectionHeading = styled.div`
  margin-bottom: var(--spacing-16);
`;
export const State = styled.div`
  padding: var(--spacing-32);
  border-radius: var(--border-radius-large);
  background: var(--color-white);
  text-align: center;
`;
export const DateGroup = styled.section<{ $selected?: boolean }>`
  margin-bottom: var(--spacing-20);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-large);
  outline: ${({ $selected }) => ($selected ? "var(--border-width-medium) solid var(--color-salmon)" : "none")};
  outline-offset: var(--spacing-4);
  scroll-margin-top: var(--spacing-32);
`;
export const DateHeading = styled.h4`
  margin: 0 0 var(--spacing-8);
  color: var(--color-midnight);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-transform: capitalize;
`;
