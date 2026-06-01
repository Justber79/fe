import { Tag } from "@/components/styled/tags";
import { ActivitySpan } from "@/components/styled/text";
import { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  tags: string[];
  backgroundColor?: TagBackgroundKeys;
  icon?: ReactNode;
  max?: number;
}

const defaultBGColor = "var(--color-papaya)";

const bgTextColorMap = {
  [defaultBGColor]: "var(--color-white)",
  "var(--color-white)": "var(--color-midnight)",
  "var(--color-pink-100)": "var(--color-midnight)",
  "var(--color-pink-50)": "var(--color-midnight-light)",
  "var(--color-salmon)": "var(--color-midnight)",
};

type TagBackgroundKeys = keyof typeof bgTextColorMap;

export function Tags({ tags, backgroundColor = defaultBGColor, icon, max }: Props) {
  const filtered = tags.filter(Boolean);
  const shown = max !== undefined ? filtered.slice(0, max) : filtered;
  const overflow = max !== undefined ? filtered.length - max : 0;

  return (
    <TagsContainer>
      {shown.map((tag) => (
        <Tag key={tag} $backgroundColor={backgroundColor}>
          {icon}
          <ActivitySpan color={bgTextColorMap[backgroundColor]}>{tag}</ActivitySpan>
        </Tag>
      ))}
      {overflow > 0 && (
        <OverflowTag>+{overflow}</OverflowTag>
      )}
    </TagsContainer>
  );
}

export default Tags;

/** Styles */
const OverflowTag = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: var(--dashboard-volunteers-card-paragraph-fontSize, 0.875rem);
  font-weight: 600;
  color: var(--color-midnight);
  padding: 4px 8px;
  border-radius: 4px;
  background: var(--color-grey-100, #f3f4f6);
  white-space: nowrap;
`;

export const TagsContainer = styled.div`
  display: flex;
  width: fit-content;
  justify-content: left;
  flex-wrap: wrap;
  gap: var(--spacing-8);
`;
