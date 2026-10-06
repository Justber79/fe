import axios from "axios";
import { cancelLogout, startLogout } from "@/config/axios";
import { apiPathAuthLogout } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { clearAuthHint } from "@/utils/helpers";

export const useLogout = () => {
  return useMutationQuery<void, unknown>({
    mutationFn: async () => {
      await startLogout();
      const response = await axios.post(apiPathAuthLogout);
      return response.data;
    },
    noToast: true,
    onErrorCallback: () => {
      cancelLogout();
    },
    // The full page load below resets the query cache.
    onSuccessCallback: () => {
      clearAuthHint();
      window.location.href = "/login";
    },
  });
};
