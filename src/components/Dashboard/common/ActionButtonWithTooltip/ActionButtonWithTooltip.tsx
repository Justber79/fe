import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import { ActionButton } from "./styles";

type Props = {
  tooltipText: string;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: ReactNode;
};

export function ActionButtonWithTooltip({ tooltipText, disabled, onClick, ariaLabel, children }: Props) {
  return (
    <Tooltip text={tooltipText}>
      <ActionButton onClick={onClick} $disabled={disabled} disabled={disabled} aria-label={ariaLabel}>
        {children}
      </ActionButton>
    </Tooltip>
  );
}
