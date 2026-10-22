import { TextareaHTMLAttributes, useId } from "react";
import styled from "styled-components";

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> & {
  label?: string;
  value: string;
  onChange: (value: string) => void;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
`;

const Label = styled.label`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-midnight);
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  border: var(--border-width-thin) solid var(--color-grey-400);
  border-radius: var(--border-radius-small);
  padding: var(--spacing-12) var(--spacing-16);
  font-size: var(--font-size-sm);
  color: var(--color-midnight);
  background: var(--color-white);
  resize: vertical;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    border-color: var(--color-midnight);
  }

  &::placeholder {
    color: var(--color-grey-400);
  }

  &:disabled {
    background: var(--color-grey-50);
  }
`;

const CharCount = styled.p`
  font-size: var(--font-size-xs);
  color: var(--color-grey-500);
  text-align: right;
  margin: 0;
`;

export function TextArea({ label, value, onChange, maxLength, rows = 4, id, ...rest }: Props) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <Wrapper>
      {label && <Label htmlFor={textareaId}>{label}</Label>}
      <StyledTextarea
        {...rest}
        id={textareaId}
        value={value}
        rows={rows}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
      {maxLength !== undefined && (
        <CharCount aria-live="polite">
          {value.length}/{maxLength}
        </CharCount>
      )}
    </Wrapper>
  );
}
