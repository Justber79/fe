import Button from "../Button/Button";
import { CheckboxProps } from "../Checkbox/Checkbox";

export function CheckButton({
  height,
  width,
  label,
  labelFontSize,
  onChange,
  checked,
  "aria-label": ariaLabel,
}: CheckboxProps) {
  return (
    <Button
      onClick={() => onChange(!checked)}
      textFontSize={labelFontSize || "var(--check-button-label-font-size)"}
      text={label}
      aria-label={label ? undefined : ariaLabel}
      height={height}
      width={width}
      backgroundcolor={checked ? "var(--color-violet-500)" : "var(--color-white)"}
      textColor={checked ? "var(--color-white)" : "var(--color-midnight)"}
      padding="var(--check-button-padding)"
      border="var(--check-button-border)"
      textFontWeight="var(--check-button-label-font-weight)"
    />
  );
}

export default CheckButton;
