import { apiPathOpportunityVolunteer } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { isEmailNoteNotSent, withEmailNote } from "@/utils/apiErrors";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ApiOpportunityVolunteerPost } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const useSuggestVolunteerOpportunity = (onSuccess?: () => void, queryKeyToInvalidate?: (string | number)[]) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutationQuery<ApiOpportunityVolunteerPost, unknown>({
    mutationFn: async (payload) => {
      const response = await axios.post(apiPathOpportunityVolunteer, withEmailNote(payload));
      return response.data;
    },
    successMessage: "dashboard.volunteerProfile.suggestDialog.success",
    onSuccessCallback: onSuccess,
    queryKeyToInvalidate,
    onErrorCallback: (error) => {
      if (!isEmailNoteNotSent(error)) return false;
      toast.error(t("message.apiErrors.emailNoteNotSent"));
      if (queryKeyToInvalidate) queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      onSuccess?.();
      return true;
    },
  });
};
