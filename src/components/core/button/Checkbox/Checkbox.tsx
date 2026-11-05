import styled from "styled-components";
import CheckboxSVG from "../../../svg/CheckboxSVG";
import { Paragraph } from "../../../styled/text";

const CheckboxContainer = styled.label<{ $labelPosition: "before" | "after"; $gap: string }>`
  display: flex;
  flex-direction: ${({ $labelPosition }) => ($labelPosition === "before" ? "row-reverse" : "row")};
  align-items: center;
  gap: ${({ $gap }) => $gap};
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
    outline-offset: calc(-1 * var(--border-width-medium));
  }
`;

export interface CheckboxProps {
  width: string;
  height: string;
  color?: string;
  label?: string;
  labelFontSize?: string;
  labelGap?: string;
  labelLineHeight?: string;
  onChange: (checked: boolean) => void;
  checked: boolean;
  labelPosition?: "before" | "after";
}

export function Checkbox({
  height,
  width,
  color = "var(--color-midnight)",
  label,
  labelFontSize,
  labelGap = "var(--spacing-8)",
  labelLineHeight = "var(--line-height-32)",
  onChange,
  checked,
  labelPosition = "after",
}: CheckboxProps) {
  return (
    <CheckboxContainer $labelPosition={labelPosition} $gap={labelGap} onClick={(e) => e.stopPropagation()}>
      <CheckboxControl>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <CheckboxSVG width={width} height={height} checked={checked} color={color} aria-hidden="true" />
      </CheckboxControl>

      {label && (
        <Paragraph
          as="span"
          fontWeight={
            checked ? "var(--checkbox-label-font-weight-selected)" : "var(--checkbox-label-font-weight-not-selected)"
          }
          fontSize={labelFontSize || "var(--checkbox-label-font-size)"}
          lineheight={labelLineHeight}
        >
          {label}
        </Paragraph>
      )}
    </CheckboxContainer>
  );
}

export default Checkbox;
