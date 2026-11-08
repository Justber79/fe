import { apiPathVolunteer } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { getLocalizedErrorMessage } from "@/utils/apiErrors";
import axios from "axios";
import { ApiVolunteerSuggestionRequestPost } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const i18nPrefix = "dashboard.volunteerProfile.requestSuggest.errors";

const errorKey = (error: unknown): string | undefined => {
  if (!axios.isAxiosError(error)) return undefined;
  const status = error.response?.status;
  const message: string = error.response?.data?.message ?? "";
  if (status === 409) return "alreadyRequested";
  if (status === 403 && message.includes("inactive")) return "ngoInactive";
  if (status === 400 && message.includes("no active members")) return "noOwnerMembers";
  if (status === 400 && message.includes("no longer open")) return "notOpen";
  return undefined;
};

export const useRequestOwnerSuggestion = (volunteerId: number) => {
  const { t } = useTranslation();
  return useMutationQuery<ApiVolunteerSuggestionRequestPost, unknown>({
    apiPath: `${apiPathVolunteer}/${volunteerId}/suggestion-request`,
    method: "post",
    successMessage: "dashboard.volunteerProfile.requestSuggest.ownerSuccess",
    queryKeyToInvalidate: ["volunteer", String(volunteerId)],
    onErrorCallback: (error) => {
      const key = errorKey(error);
      toast.error(key ? t(`${i18nPrefix}.${key}`) : getLocalizedErrorMessage(error, t));
      return true;
    },
  });
};
