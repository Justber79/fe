import { apiPathComment } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiCommentTaggedPerson } from "need4deed-sdk";

export const usePatchTaggedComments = (commentId: number, personId: string | number) => {
  return useMutationQuery<ApiCommentTaggedPerson, null>({
    apiPath: `${apiPathComment}/${commentId}/read`,
    method: "patch",
    queryKeyToInvalidate: ["tagComments", String(personId)],
    noToast: true,
  });
};
