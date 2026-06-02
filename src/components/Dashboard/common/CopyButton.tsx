import { ActionButtonWithTooltip } from "../Profile/sections/VolunteerProfileDocument/ActionButtonWithTooltip";
import Copy from "@/components/svg/Copy";

interface CopyButtonProps {
  onClick: () => void;
}

export function CopyButton({ onClick }: CopyButtonProps) {
  return (
    <ActionButtonWithTooltip tooltipText="Copy all emails" ariaLabel="Copy all emails" onClick={onClick}>
      <Copy width={18} height={18} />
    </ActionButtonWithTooltip>
  );
}
