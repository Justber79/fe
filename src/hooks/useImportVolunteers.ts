import { apiPathAgent } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import axios from "axios";
import { ApiVolunteerImportPost, ApiVolunteerImportResult } from "need4deed-sdk";

const reportOf = (error: unknown): ApiVolunteerImportResult | undefined =>
  axios.isAxiosError(error) && error.response?.status === 400 ? error.response.data?.data : undefined;

export const useImportVolunteers = (agentId: number, onReport: (report: ApiVolunteerImportResult) => void) =>
  useMutationQuery<ApiVolunteerImportPost, { data: ApiVolunteerImportResult }>({
    mutationFn: async (payload) => (await axios.post(`${apiPathAgent}/${agentId}/volunteer-import`, payload)).data,
    noToast: true,
    queryKeyToInvalidate: ["volunteers"],
    onSuccessCallback: (response) => onReport(response.data),
    onErrorCallback: (error) => {
      const report = reportOf(error);
      if (!report) return false;
      onReport(report);
      return true;
    },
  });
