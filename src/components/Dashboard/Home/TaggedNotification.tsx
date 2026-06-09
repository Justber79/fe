import { Heading4 } from "@/components/styled/text";
import { ChatCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { TagRow } from "./styles";
import { type DashboardEntityType } from "@/hooks/useGetEntityTitle";
import { useGetEntityTitle } from "@/hooks/useGetEntityTitle";

type Props = {
  entityType: DashboardEntityType;
  entityId: number;
  authorName: string;
  apiPath: string;
  link: string;
};

export default function TaggedNotification({ entityType, entityId, authorName, apiPath, link }: Props) {
  const { t } = useTranslation();

  const { title, isLoading, isError, error } = useGetEntityTitle(entityType, entityId, apiPath);

  if (isLoading) {
    return <Heading4>{t("dashboard.home.content.loading")}</Heading4>;
  }

  if (isError) {
    return <Heading4>{error?.message}</Heading4>;
  }
  return (
    <TagRow>
      <Link
        href={{
          pathname: link,
          hash: entityType === "opportunity" ? "opportunity-volunteers-container" : "communication-tracker-container",
        }}
      >
        <ChatCircleIcon size={22} />
        <Heading4>
          {t("dashboard.home.content.taggedComment", { user: authorName, entityTitle: title, entityType: entityType })}
        </Heading4>
      </Link>
    </TagRow>
  );
}
