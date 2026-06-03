import { ActionButtonWithTooltip } from "../Profile/sections/VolunteerProfileDocument/ActionButtonWithTooltip";
import Copy from "@/components/svg/Copy";

interface CopyButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function CopyButton({ onClick, disabled }: CopyButtonProps) {
  return (
    <ActionButtonWithTooltip
      tooltipText="Copy all emails"
      ariaLabel="Copy all emails"
      onClick={onClick}
      disabled={disabled}
    >
      <Copy width={18} height={18} />
    </ActionButtonWithTooltip>
  );
}
