import styled from "styled-components";
import CheckboxSVG from "../../../svg/CheckboxSVG";
import { Paragraph } from "../../../styled/text";

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-8);
  cursor: pointer;
`;

export interface CheckboxProps {
  width: string;
  height: string;
  color?: string;
  label?: string;
  labelFontSize?: string;
  onChange: (checked: boolean) => void;
  checked: boolean;
}

export function Checkbox({
  height,
  width,
  color = "var(--color-midnight)",
  label,
  labelFontSize,
  onChange,
  checked,
}: CheckboxProps) {
  return (
    <CheckboxContainer onClick={() => onChange(!checked)}>
      <CheckboxSVG width={width} height={height} checked={checked} color={color} />

      {label && (
        <Paragraph
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
