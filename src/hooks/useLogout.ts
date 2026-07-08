import { apiPathAuthLogout } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { clearAuthHint } from "@/utils/helpers";

export const useLogout = () => {
  return useMutationQuery<void, unknown>({
    apiPath: apiPathAuthLogout,
    method: "post",
    onSuccessCallback: () => {
      clearAuthHint();
      window.location.href = "/login";
    },
  });
};
