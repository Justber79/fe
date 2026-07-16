import { Heading4 } from "@/components/styled/text";
import { ChatCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { TagRow } from "./styles";
import { type DashboardEntityType } from "@/hooks/useGetEntityTitle";
import { useGetEntityTitle } from "@/hooks/useGetEntityTitle";
import { usePatchTaggedComments } from "@/hooks/usePatchTaggedComments";

type Props = {
  entityType: DashboardEntityType;
  entityId: number;
  authorName: string;
  apiPath: string;
  link: string;
  personId: number;
  commentId: number;
  isRead: boolean;
};

export default function TaggedNotification({
  entityType,
  entityId,
  authorName,
  apiPath,
  link,
  personId,
  commentId,
  isRead,
}: Props) {
  const { t } = useTranslation();
  const { mutate: updateReadTagComment } = usePatchTaggedComments(commentId, personId);
  const { title, isLoading, isError, error } = useGetEntityTitle(entityType, entityId, apiPath);

  const handleReadTag = () => {
    if (isRead) return;
    updateReadTagComment({ id: personId, readAt: new Date() });
  };

  if (isLoading) {
    return <Heading4>{t("dashboard.home.content.loading")}</Heading4>;
  }

  if (isError) {
    return <Heading4>{error?.message}</Heading4>;
  }
  return (
    <TagRow $isRead={isRead}>
      <Link
        href={{
          pathname: link,
          query: { scrollTo: "coordinator-comments" },
        }}
        onClick={handleReadTag}
      >
        <ChatCircleIcon size={22} />
        <Heading4>
          {t("dashboard.home.content.taggedComment", { user: authorName, entityTitle: title, entityType: entityType })}
        </Heading4>
      </Link>
    </TagRow>
  );
}
