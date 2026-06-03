import { ActionButtonWithTooltip } from "../Profile/sections/VolunteerProfileDocument/ActionButtonWithTooltip";
import Copy from "@/components/svg/Copy";

interface CopyButtonProps {
  onClick: () => void;
  disabled: boolean;
  tooltipText: string;
  ariaLabel: string;
}

export function CopyButton({ onClick, disabled, tooltipText, ariaLabel }: CopyButtonProps) {
  return (
    <ActionButtonWithTooltip tooltipText={tooltipText} ariaLabel={ariaLabel} onClick={onClick} disabled={disabled}>
      <Copy width={18} height={18} />
    </ActionButtonWithTooltip>
  );
}
