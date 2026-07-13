import { apiPathAuthLogout, USER_QUERY_KEY } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { clearAuthHint } from "@/utils/helpers";
import { useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutationQuery<void, unknown>({
    apiPath: apiPathAuthLogout,
    method: "post",
    onSuccessCallback: () => {
      queryClient.removeQueries({ queryKey: USER_QUERY_KEY, exact: true });
      clearAuthHint();
      window.location.href = "/login";
    },
  });
};
