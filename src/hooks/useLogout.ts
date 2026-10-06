import axios from "axios";
import { waitForSessionRefresh } from "@/config/axios";
import { apiPathAuthLogout } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { clearAuthHint } from "@/utils/helpers";

export const useLogout = () => {
  return useMutationQuery<void, unknown>({
    mutationFn: async () => {
      await waitForSessionRefresh();
      const response = await axios.post(apiPathAuthLogout);
      return response.data;
    },
    noToast: true,
    // The full page load below resets the query cache.
    onSuccessCallback: () => {
      clearAuthHint();
      window.location.href = "/login";
    },
  });
};
