import { EntityType } from "@/components/Dashboard/Profile/types";
import { apiPathComment } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { Id } from "need4deed-sdk";

type UpdateCommentData = {
  text: string;
  taggedPersonIds?: number[];
};

export const useUpdateComment = (entityId: Id, commentId: number, entityType: EntityType = "volunteer") => {
  return useMutationQuery<UpdateCommentData, { message: string }>({
    apiPath: `${apiPathComment}/${commentId}`,
    method: "patch",
    successMessage: "dashboard.commentsSection.commentUpdated",
    queryKeyToInvalidate: [entityType, String(entityId)],
  });
};
