import { EntityType } from "@/components/Dashboard/Profile/types";
import { apiPathComment } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { EntityTableName, Id } from "need4deed-sdk";

type CreateCommentData = {
  text: string;
  entityType: EntityTableName | string;
  entityId: Id;
<<<<<<< HEAD
  taggedPersonIds?: number[];
=======
  taggedUserIds?: number[];
>>>>>>> 87900d0 (adds taggedUserIds to create comment req body)
};

export const useCreateComment = (entityId: Id, entityType: EntityType = "volunteer") => {
  return useMutationQuery<CreateCommentData, { message: string }>({
    apiPath: apiPathComment,
    method: "post",
    successMessage: "dashboard.commentsSection.commentAdded",
    queryKeyToInvalidate: [entityType, String(entityId)],
  });
};
