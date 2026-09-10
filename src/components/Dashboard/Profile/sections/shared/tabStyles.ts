import { Heading4 } from "@/components/styled/text";
import styled from "styled-components";

export const TabsContainer = styled.div`
  display: flex;
  margin-top: var(--volunteer-profile-opportunities-tabs-margin-top);
  gap: var(--volunteer-profile-opportunities-tabs-gap);
  border-bottom: var(--volunteer-profile-opportunities-tabs-border-bottom);
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

type TabHeadingProps = {
  $isSelected: boolean;
};

export const TabHeading = styled(Heading4)<TabHeadingProps>`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--volunteer-profile-opportunities-tab-heading-gap);
  border-bottom: ${(props) =>
    props.$isSelected ? "var(--volunteer-profile-opportunities-tab-heading-border-bottom)" : "none"};
  color: ${(props) => (props.$isSelected ? "var(--color-violet-500)" : "none")};
  padding: var(--volunteer-profile-opportunities-tab-heading-padding);
  margin: var(--volunteer-profile-opportunities-tab-heading-margin);
  flex-shrink: 0;
`;

export const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--volunteer-profile-opportunities-tab-count-badge-min-width);
  height: var(--volunteer-profile-opportunities-tab-count-badge-height);
  padding: var(--volunteer-profile-opportunities-tab-count-badge-padding);
  border-radius: var(--volunteer-profile-opportunities-tab-count-badge-border-radius);
  background: var(--volunteer-profile-opportunities-tab-count-badge-background);
  color: var(--volunteer-profile-opportunities-tab-count-badge-color);
  font-size: var(--volunteer-profile-opportunities-tab-count-badge-font-size);
  font-weight: var(--volunteer-profile-opportunities-tab-count-badge-font-weight);
  line-height: var(--volunteer-profile-opportunities-tab-count-badge-line-height);
`;
