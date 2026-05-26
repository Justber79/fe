import styled from "styled-components";
import { FlexColumn } from "@/components/styled/FlexColumn";

export const Container = styled(FlexColumn).attrs({
  $gap: "var(--spacing-24)",
  $width: "100%",
})`
  margin-top: var(--spacing-24);
`;

export const CommentItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0;
  gap: var(--spacing-16);
  width: 100%;
  align-self: stretch;
`;

export const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: var(--spacing-8);
  flex-grow: 1;
`;

export const TopInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: var(--spacing-16);
`;

export const AuthorName = styled.div`
  font-style: normal;
  font-weight: var(--comments-author-font-weight);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-24);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
`;

export const Timestamp = styled.div`
  font-style: normal;
  font-weight: var(--comments-timestamp-font-weight);
  font-size: var(--font-size-16);
  line-height: var(--line-height-20);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-grey-500);
`;

export const CommentText = styled.div`
  width: 100%;
  font-style: normal;
  font-weight: var(--comments-text-font-weight);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-24);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  align-self: stretch;
  white-space: pre-wrap;

  .tag {
    color: var(--color-midnight);
    font-weight: bold;
    text-decoration: none;
    border-radius: var(--border-radius-xs);
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const MenuAction = styled.button`
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-midnight);
  padding: var(--spacing-8);

  &:hover {
    opacity: 0.7;
  }
`;

export const NewCommentSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: var(--spacing-16);
  width: 100%;
  height: 200px;
  overflow-y: hidden;
  align-self: stretch;
  border: var(--border-width-thin) solid var(--color-grey-200);
  border-radius: var(--border-radius-small);
`;

export const TextArea = styled.textarea`
  position: absolute;
  padding: var(--spacing-16);
  margin: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: transparent;
  color: transparent;
  caret-color: var(--color-midnight);
  font-family: inherit;
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  letter-spacing: var(--letter-spacing-tight);
  white-space: pre-wrap;
  word-wrap: break-word;
  box-sizing: border-box;
  z-index: 2;
  resize: none;
  overflow-y: scroll;
  border: none;
  scrollbar-gutter: stable;

  &::placeholder {
    color: var(--color-grey-500);
  }

  &:focus {
    outline: none;
  }
`;

export const AddCommentButton = styled.button`
  align-self: end;
  padding: var(--spacing-16) var(--spacing-24);
  gap: var(--spacing-8);
  height: 56px;
  aspect-ratio: 4/1;
  background: var(--color-aubergine);
  border-radius: var(--button-border-radius);
  border: none;
  cursor: pointer;
  font-style: normal;
  font-weight: var(--comments-button-font-weight);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  text-align: center;
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-white);
  opacity: 1;
  transition: var(--transition-all);

  &:disabled {
    background: var(--color-grey-200);
    cursor: not-allowed;
    color: var(--color-grey-500);
    opacity: 0.6;
  }

  &:hover:not(:disabled) {
    background: var(--color-aubergine-light);
  }
`;

export const CommentEditButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: var(--spacing-16);
  width: 100%;
`;

export const EditCancelButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-16) var(--spacing-24);
  gap: var(--spacing-8);
  height: 56px;
  background: transparent;
  border: var(--border-width-medium) solid var(--color-aubergine);
  border-radius: var(--button-border-radius);
  cursor: pointer;
  font-style: normal;
  font-weight: var(--comments-button-font-weight);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  text-align: center;
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-aubergine);
  transition: var(--transition-all);

  &:hover {
    background: var(--color-aubergine-subtle);
  }
`;

export const EditSaveButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-16) var(--spacing-24);
  gap: var(--spacing-8);
  height: 56px;
  background: var(--color-aubergine);
  border-radius: var(--button-border-radius);
  border: none;
  cursor: pointer;
  font-style: normal;
  font-weight: var(--comments-button-font-weight);
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  text-align: center;
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-white);
  opacity: 1;
  transition: var(--transition-all);

  &:disabled {
    background: var(--color-grey-200);
    cursor: not-allowed;
    color: var(--color-grey-500);
    opacity: 0.6;
  }

  &:hover:not(:disabled) {
    background: var(--color-aubergine-light);
  }
`;

export const TagOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: var(--spacing-16);
  margin: 0;
  font-family: inherit;
  font-size: var(--text-p-font-size);
  line-height: var(--text-p-line-height);
  letter-spacing: var(--letter-spacing-tight);
  white-space: pre-wrap;
  word-wrap: break-word;
  box-sizing: border-box;
  color: var(--color-midnight);
  z-index: 1;
  pointer-events: none;
  user-select: none;
  font-style: normal;
  font-weight: var(--font-weight-regular);
  will-change: transform;
  scrollbar-gutter: stable;
  overflow-y: hidden;
  .tag {
    color: var(--color-midnight);
    text-decoration: none;
    padding: 0;
    margin: 0;
    border: none;
    -webkit-text-stroke: var(--tag-text-stroke);
  }
`;

export const AutocompleteContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 130px;
  position: absolute;
  padding: 1rem;
  border: var(--border-width-thin) solid var(--color-grey-200);
  border-radius: var(--border-radius-xs);
  background: white;
  overflow-y: scroll;
  z-index: 5;
`;

export const AutocompleteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: var(--tag-autocomplete-padding);
  font-size: var(--tag-autocomplete-font-size);
  cursor: pointer;
  user-select: none;
  width: 100%;
  border-radius: var(--editableField-optionRow-borderRadius);
  transition: background-color 0.2s ease;
  gap: var(--editableField-optionRow-gap);

  &:hover {
    background-color: var(--color-orchid-light);
  }
`;
