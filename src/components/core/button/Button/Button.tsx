import styled from "styled-components";
import { ButtonSpan } from "../../../styled/text";
import { IconName, iconNameMap } from "./icon";
import { IconDiv } from "@/components/styled/container";

const defaultBGColor = "var(--color-aubergine)";

const hoverBGColorMap = {
  "var(--color-orchid)": "var(--color-orchid-light)",
  [defaultBGColor]: "var(--color-aubergine-light)",
  "var(--color-midnight)": "var(--color-midnight-light)",
  "var(--color-white)": "var(--color-orchid-light)",
  "var(--color-orchid-subtle)": "var(--color-aubergine-subtle)",
  "var(--color-orchid-light)": "var(--color-orchid)",
  "var(--color-grey-50)": "var(--color-aubergine)",
  "var(--color-violet-500)": "var(--color-violet-400)",
  transparent: "transparent",
};

type BackgroundColorKeys = keyof typeof hoverBGColorMap;

interface StyledButtonProps extends React.HTMLProps<HTMLButtonElement> {
  backgroundcolor?: BackgroundColorKeys;
  gap?: string;
  padding?: string;
  $iconPosition?: "left" | "right";
  border?: string;
  $textHoverColor?: string;
}

const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => props.height || "var(--button-height)"};
  width: ${(props) => props.width || "var(--button-width)"};
  border-radius: var(--button-border-radius);
  background-color: ${(props) => props.backgroundcolor || defaultBGColor};
  border: ${(props) => props.border || "none"};
  white-space: pre-wrap;
  gap: ${(props) => props.gap};
  padding: ${(props) => props.padding};
  flex-direction: ${(props) => (props.$iconPosition === "right" ? "row-reverse" : "row")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition:
    background-color 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    background-color: ${(props) => hoverBGColorMap[props.backgroundcolor || defaultBGColor]};

    ${ButtonSpan} {
      color: ${(props) => props.$textHoverColor};
    }
  }

  &:disabled {
    background-color: var(--color-grey-200);
    opacity: 0.6;

    &:hover {
      background-color: var(--color-grey-200);
    }

    ${ButtonSpan} {
      color: var(--color-grey-500);
    }
  }
`;

export interface ButtonProps {
  text?: string;
  textFontSize?: string;
  onClick?: (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void);
  backgroundcolor?: BackgroundColorKeys;
  textColor?: string;
  textHoverColor?: string;
  textFontWeight?: number | string;
  height?: string;
  width?: string;
  iconName?: IconName;
  iconSize?: string;
  iconColor?: string;
  iconPosition?: "left" | "right";
  border?: string;
  disabled?: boolean;
  padding?: string;
  type?: "button" | "submit" | "reset";
  ["aria-describedby"]?: string;
}

export function Button({
  text,
  textFontSize,
  onClick,
  backgroundcolor,
  textColor,
  textHoverColor,
  textFontWeight,
  height,
  width,
  iconName,
  iconSize,
  iconColor = "var(--color-white)",
  iconPosition = "left",
  border,
  disabled,
  padding,
  type = "button",
  ["aria-describedby"]: ariaDescribedBy,
}: ButtonProps) {
  return (
    <StyledButton
      type={type}
      disabled={disabled}
      onClick={onClick}
      backgroundcolor={backgroundcolor}
      height={height}
      width={width}
      gap={text ? "var(--spacing-12)" : "0px"}
      padding={padding || (text ? "var(--button-padding)" : "0px")}
      $iconPosition={iconPosition}
      border={border}
      $textHoverColor={textHoverColor}
      aria-describedby={ariaDescribedBy}
    >
      {iconName && (
        <IconDiv color={iconColor} size={iconSize}>
          {iconNameMap[iconName]}
        </IconDiv>
      )}

      {text && (
        <ButtonSpan fontSize={textFontSize} color={textColor} fontWeight={textFontWeight}>
          {text}
        </ButtonSpan>
      )}
    </StyledButton>
  );
}

export default Button;
