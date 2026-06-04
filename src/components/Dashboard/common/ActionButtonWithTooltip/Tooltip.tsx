import { ReactNode, useState, useRef, useEffect } from "react";
import styled from "styled-components";

type Props = {
  text: string;
  children: ReactNode;
};

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const TooltipText = styled.div<{ $visible: boolean }>`
  visibility: ${(props) => (props.$visible ? "visible" : "hidden")};
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  background: var(--document-tooltip-background);
  color: var(--document-tooltip-color);
  font-style: normal;
  font-weight: var(--document-tooltip-font-weight);
  font-size: var(--document-tooltip-font-size);
  line-height: var(--document-tooltip-line-height);
  letter-spacing: var(--document-tooltip-letter-spacing);
  padding: var(--document-tooltip-padding);
  border-radius: var(--document-tooltip-border-radius);
  position: fixed;
  white-space: nowrap;
  transition: var(--transition-opacity-visibility);
  z-index: var(--document-tooltip-z-index);
  pointer-events: none;
  transform: var(--document-tooltip-transform);

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: calc(var(--document-tooltip-arrow-size) * -1);
    border-width: var(--document-tooltip-arrow-size);
    border-style: solid;
    border-color: var(--document-tooltip-background) transparent transparent transparent;
  }
`;

export function Tooltip({ text, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        left: rect.left + rect.width / 2,
        top: rect.top,
      });
    }
  }, [visible]);

  return (
    <TooltipContainer ref={containerRef} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      <TooltipText $visible={visible} style={{ left: `${position.left}px`, top: `${position.top}px` }}>
        {text}
      </TooltipText>
    </TooltipContainer>
  );
}
