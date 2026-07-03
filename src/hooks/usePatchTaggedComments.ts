import { apiPathComment } from "@/config/constants";
import { useMutationQuery } from "@/hooks";

type PatchTaggedComments = {
  read_at: Date;
};

export const usePatchTaggedComments = (commentId: number, personId: string | number) => {
  return useMutationQuery<PatchTaggedComments, null>({
    apiPath: `${apiPathComment}/${commentId}/read`,
    method: "patch",
    queryKeyToInvalidate: ["tagComments", String(personId)],
    noToast: true,
  });
};
