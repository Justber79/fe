import { CSSProperties } from "react";
import styled from "styled-components";

const BASE_WIDTH = 50;
const BASE_HEIGHT = 24;
const BASE_CIRCLE_SIZE = 20;

type ScaleValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface Props {
  isChecked: boolean;
  onToggle: () => void;
  scale?: ScaleValue;
}

export function SwitchButton({ isChecked, onToggle, scale = 5 }: Props) {
  const width = (BASE_WIDTH / 5) * scale;
  const height = (BASE_HEIGHT / 5) * scale;
  const circleSize = (BASE_CIRCLE_SIZE / 5) * scale;

  return (
    <SwitchContainer>
      <SwitchButtonStyled
        onClick={onToggle}
        role="switch"
        type="button"
        aria-checked={isChecked}
        aria-label={`Toggle ${isChecked ? "on" : "off"}`}
        width={width}
        height={height}
        $isChecked={isChecked}
      >
        <SwitchCircle $circleSize={circleSize} height={height} width={width} $isChecked={isChecked} />
      </SwitchButtonStyled>
    </SwitchContainer>
  );
}

export default SwitchButton;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;

interface SwitchButtonProps extends CSSProperties {
  width: number;
  height: number;
  $isChecked: boolean;
}

const SwitchButtonStyled = styled.button<SwitchButtonProps>`
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
  background: ${(props) => (props.$isChecked ? "var(--color-green-500)" : "var(--color-grey-200)")};
  border: none;
  padding: 0;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: ${(props) => props.height / 2}px;
`;

interface SwitchCircleProps {
  $circleSize: number;
  height: number;
  width: number;
  $isChecked: boolean;
}

const SwitchCircle = styled.div<SwitchCircleProps>`
  position: absolute;
  border-radius: 50%;
  background: var(--color-white);
  transition: left 0.3s;
  width: ${(props) => props.$circleSize}px;
  height: ${(props) => props.$circleSize}px;
  top: ${(props) => (props.height - props.$circleSize) / 2}px;
  left: ${(props) => (props.$isChecked ? `${props.width - props.$circleSize - 2}px` : "2px")};
`;
