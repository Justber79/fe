import styled from "styled-components";

export const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
  height: max(
    520px,
    calc(
      100dvh - var(--layout-static-page-header-height) - var(--dashboard-base-container-padding-top) - var(
          --dashboard-base-container-padding-bottom
        )
    )
  );

  @media (max-width: 767px) {
    height: max(
      520px,
      calc(
        100dvh - var(--layout-static-page-header-height) - var(--dashboard-base-container-padding-top) - var(
            --dashboard-base-container-padding-bottom
          ) - var(--dashboard-navigation-bar-mobile-height)
      )
    );
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-8);
  padding: var(--spacing-16);
  height: 320px;
`;

export const FeedScrollContainer = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  gap: var(--spacing-12);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0 var(--spacing-8) var(--spacing-8);
`;

export const LoadOlderIndicator = styled.div`
  display: flex;
  min-height: var(--spacing-24);
  align-items: center;
  justify-content: center;
  color: var(--color-midnight);
`;

export const FeedPost = styled.article`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
  padding: var(--spacing-20);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--card-border-radius);
  background-color: var(--color-white);
  box-shadow: 0 4px 16px rgba(38, 23, 44, 0.06);
`;

export const PostHeader = styled.header`
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
`;

export const PostAuthor = styled.strong`
  color: var(--color-midnight);
  font-size: var(--font-size-lg);
`;

export const PostTimestamp = styled.time`
  color: var(--color-grey-500);
  font-size: var(--font-size-sm);
`;

export const Avatar = styled.img`
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 50%;
  object-fit: cover;
`;

export const AvatarInitials = styled.div`
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border-radius: 50%;
  background: var(--color-pink-50);
  color: var(--color-aubergine);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
`;

export const PostHeaderText = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--spacing-4);
`;

export const PostBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
  padding-left: 56px;

  @media (max-width: 767px) {
    padding-left: 0;
  }
`;

export const PostText = styled.p`
  margin: 0;
  color: var(--color-midnight);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  white-space: pre-wrap;
  overflow-wrap: anywhere;

  .tag {
    color: var(--color-aubergine);
  }
`;

export const PostMenuButton = styled.button`
  display: grid;
  width: 40px;
  height: 40px;
  padding: 0;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--color-midnight);
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: var(--color-pink-50);
  }
`;

export const PostMenuWrapper = styled.div`
  position: relative;
  margin-left: auto;
`;

export const ActionMenu = styled.div`
  position: absolute;
  z-index: 10;
  top: calc(100% + var(--spacing-4));
  right: 0;
  display: flex;
  width: 180px;
  flex-direction: column;
  padding: var(--spacing-8) 0;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  background: var(--color-white);
  box-shadow: 0 10px 30px -12px rgba(143, 81, 138, 0.35);
`;

export const ActionMenuItem = styled.button<{ $danger?: boolean }>`
  padding: var(--spacing-12) var(--spacing-16);
  border: 0;
  background: transparent;
  color: ${({ $danger }) => ($danger ? "var(--color-red-600)" : "var(--color-midnight)")};
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: var(--color-pink-50);
  }
`;

export const OpportunityList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
  margin: var(--spacing-8) 0 var(--spacing-12);
`;

export const OpportunityChip = styled.a`
  display: inline-flex;
  max-width: 100%;
  padding: var(--spacing-8) var(--spacing-12);
  border: 1px solid var(--color-aubergine);
  border-radius: 999px;
  background: var(--color-pink-50);
  color: var(--color-aubergine);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    text-decoration: underline;
  }
`;

export const EditTextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: var(--spacing-12);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  color: var(--color-midnight);
  font: inherit;
  line-height: var(--text-p-line-height);
  resize: vertical;

  &:focus {
    border-color: var(--color-aubergine);
    outline: none;
  }
`;

export const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-8);
`;

export const EditButton = styled.button<{ $primary?: boolean }>`
  padding: var(--spacing-8) var(--spacing-16);
  border: 1px solid var(--color-aubergine);
  border-radius: var(--button-border-radius);
  background: ${({ $primary }) => ($primary ? "var(--color-aubergine)" : "transparent")};
  color: ${({ $primary }) => ($primary ? "var(--color-white)" : "var(--color-aubergine)")};
  font: inherit;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const Composer = styled.div`
  position: relative;
  flex-shrink: 0;
  padding: var(--spacing-16);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--card-border-radius);
  background: var(--color-white);
  box-shadow: 0 -8px 24px rgba(38, 23, 44, 0.08);
`;
export const ComposerTextArea = styled.textarea`
  width: 100%;
  min-height: 88px;
  padding: var(--spacing-12);
  border: 0;
  color: var(--color-midnight);
  font: inherit;
  resize: vertical;
  &:focus {
    outline: none;
  }
`;
export const ComposerActions = styled.div`
  display: flex;
  gap: var(--spacing-8);
  align-items: center;
  padding-top: var(--spacing-12);
  border-top: 1px solid var(--color-grey-200);
  > :last-child {
    margin-left: auto;
  }
`;
export const ComposerButton = styled.button<{ $primary?: boolean }>`
  padding: var(--spacing-8) var(--spacing-12);
  border: 1px solid var(--color-aubergine);
  border-radius: var(--button-border-radius);
  background: ${({ $primary }) => ($primary ? "var(--color-aubergine)" : "var(--color-white)")};
  color: ${({ $primary }) => ($primary ? "var(--color-white)" : "var(--color-aubergine)")};
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
export const ComposerPanel = styled.div`
  position: absolute;
  z-index: 20;
  bottom: 64px;
  left: var(--spacing-16);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
  width: min(360px, calc(100% - 32px));
  max-height: 280px;
  padding: var(--spacing-16);
  overflow: hidden;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
  background: white;
  box-shadow: 0 10px 30px rgba(38, 23, 44, 0.18);

  > ${ComposerButton}:last-child {
    align-self: flex-end;
    margin-top: var(--spacing-8);
  }
`;
export const OpportunityPickerPanel = styled(ComposerPanel)`
  width: min(380px, calc(100% - 32px));
  padding: var(--spacing-12);
  border-color: var(--color-grey-200);
  border-radius: 12px;
  box-shadow: 0 16px 40px -12px rgba(38, 23, 44, 0.28);
`;
export const EmojiPickerPanel = styled(ComposerPanel)`
  gap: var(--spacing-8);
  max-height: 390px;
  overflow-y: auto;
`;
export const EmojiSectionLabel = styled.span`
  color: var(--color-grey-500);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
`;
export const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, minmax(32px, 1fr));
  gap: var(--spacing-4);
`;
export const EmojiCategoryButton = styled.button<{ $selected: boolean }>`
  padding: var(--spacing-8);
  border: 0;
  border-bottom: 2px solid ${({ $selected }) => ($selected ? "var(--color-aubergine)" : "transparent")};
  background: transparent;
  font-size: var(--font-size-lg);
  cursor: pointer;
`;
export const PickerSearch = styled.input`
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  padding: var(--spacing-12) var(--spacing-16);
  border: 1px solid transparent;
  border-radius: 8px;
  background: var(--color-grey-50);
  color: var(--color-midnight);
  font: inherit;

  &::placeholder {
    color: var(--color-grey-500);
  }

  &:focus {
    border-color: var(--color-aubergine);
    background: var(--color-white);
    outline: 3px solid var(--color-pink-100);
  }
`;
export const PickerResults = styled.div`
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  padding: var(--spacing-4) var(--spacing-8) var(--spacing-4) 0;
  scrollbar-color: var(--color-grey-400) transparent;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: var(--color-grey-400);
  }
`;
export const PickerItem = styled.button`
  flex-shrink: 0;
  min-height: 40px;
  padding: var(--spacing-10) var(--spacing-12);
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--color-midnight);
  font: inherit;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;
  &:hover,
  &:focus-visible {
    background: var(--color-pink-50);
    outline: none;
  }
`;
export const PickerEmpty = styled.p`
  margin: 0;
  padding: var(--spacing-16) var(--spacing-12);
  color: var(--color-grey-500);
  font-size: var(--font-size-sm);
  text-align: center;
`;
