import styled from "styled-components";
import CheckboxSVG from "../../../svg/CheckboxSVG";
import { Paragraph } from "../../../styled/text";

const CheckboxContainer = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-8);
  cursor: pointer;
`;

const CheckboxControl = styled.span`
  position: relative;
  display: flex;
  flex-shrink: 0;

  input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: inherit;
  }

  input:focus-visible + svg {
    outline: var(--border-width-medium) solid var(--color-midnight);
    outline-offset: 0;
  }
`;

export interface CheckboxProps {
  width: string;
  height: string;
  color?: string;
  label?: string;
  labelFontSize?: string;
  onChange: (checked: boolean) => void;
  checked: boolean;
  "aria-label"?: string;
}

export function Checkbox({
  height,
  width,
  color = "var(--color-midnight)",
  label,
  labelFontSize,
  onChange,
  checked,
  "aria-label": ariaLabel,
}: CheckboxProps) {
  return (
    <CheckboxContainer onClick={(e) => e.stopPropagation()}>
      <CheckboxControl>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={label ? undefined : ariaLabel}
        />
        <CheckboxSVG width={width} height={height} checked={checked} color={color} aria-hidden="true" />
      </CheckboxControl>

      {label && (
        <Paragraph
          as="span"
          fontWeight={
            checked ? "var(--checkbox-label-font-weight-selected)" : "var(--checkbox-label-font-weight-not-selected)"
          }
          fontSize={labelFontSize || "var(--checkbox-label-font-size)"}
          lineheight="var(--line-height-32)"
        >
          {label}
        </Paragraph>
      )}
    </CheckboxContainer>
  );
}

export default Checkbox;
