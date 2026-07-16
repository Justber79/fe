import { Heading4 } from "@/components/styled/text";
import { useTranslation } from "react-i18next";
import TaggedNotification from "./TaggedNotification";
import { processEntity } from "./helpers";
import { useGetTaggedComments } from "@/hooks/useGetTaggedComments";
import { DashboardEntityType } from "@/hooks/useGetEntityTitle";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { TagContainer } from "./styles";
import { ApiComment } from "need4deed-sdk";

export function NewestTaggedComments() {
  const { t, i18n } = useTranslation();

  const user = useCurrentUser();
  const personId = (user as typeof user & { personId?: number })?.personId ?? -1;

  const { tagComments, isLoading, isError, error } = useGetTaggedComments(personId);

  const mostRecentComments = tagComments?.toReversed();

  const handleIsRead = (comment: ApiComment) => {
    if (personId <= 0) return false;
    const taggedComment = comment.taggedPersons.find((tag) => tag.id === personId);
    if (!taggedComment) return false;
    return taggedComment?.readAt !== null;
  };

  if (isLoading) {
    return <Heading4>{t("dashboard.home.content.loading")}</Heading4>;
  }

  if (isError) {
    return <Heading4>{error?.message}</Heading4>;
  }
  return (
    <TagContainer>
      {mostRecentComments && mostRecentComments.length > 0 ? (
        mostRecentComments?.map((comment) => {
          if (!comment.entityType || !comment.entityId) {
            return null;
          }

          return (
            <TaggedNotification
              key={comment.id}
              entityType={comment.entityType as DashboardEntityType}
              entityId={comment.entityId}
              authorName={comment.authorName}
              apiPath={processEntity[comment.entityType as DashboardEntityType].path}
              link={`/${i18n.language}${processEntity[comment.entityType as DashboardEntityType].linkUrl}/${comment.entityId}`}
              personId={personId}
              commentId={comment.id}
              isRead={handleIsRead(comment)}
            />
          );
        })
      ) : (
        <Heading4>{t("dashboard.home.content.noTaggedComments")}</Heading4>
      )}
    </TagContainer>
  );
}
