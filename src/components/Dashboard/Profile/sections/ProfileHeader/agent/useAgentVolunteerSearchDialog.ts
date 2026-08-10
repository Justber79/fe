import { useUpdateAgentStatus } from "@/hooks/useUpdateAgentStatus";

import { AgentVolunteerSearch, ApiAgentProfileGet } from "../../../types/agent";
import { useStatusDialog, UseStatusDialogReturn } from "../common/useStatusDialog";

export type UseAgentVolunteerSearchDialogReturn = UseStatusDialogReturn<AgentVolunteerSearch>;

export const useAgentVolunteerSearchDialog = (agent: ApiAgentProfileGet): UseAgentVolunteerSearchDialogReturn => {
  const { mutate: updateStatus } = useUpdateAgentStatus(agent.id);

  const onSave = (volunteerSearch: AgentVolunteerSearch, { onSuccess }: { onSuccess: () => void }) => {
    updateStatus({ volunteerSearch }, { onSuccess });
  };

  return useStatusDialog({
    initial: agent.volunteerSearch,
    onSave,
  });
};
