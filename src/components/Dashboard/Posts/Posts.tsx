"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/core/button";
import { EditableField } from "@/components/EditableField/EditableField";
import { DashboardLayout } from "@/components/Layout";

import { EmptyState, NewPostSection, PostsContainer } from "./styles";
import { Paragraph } from "../../styled/text";

export function Posts() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <PostsContainer>
        <EmptyState>
          <Paragraph>{t("dashboard.posts.empty")}</Paragraph>
        </EmptyState>
        <NewPostSection>
          <EditableField
            placeholder={t("dashboard.posts.inputPlaceholder")}
            mode="edit"
            type="textarea"
            value=""
            setValue={() => {}}
          />
          <Button text={t("dashboard.posts.send")} onClick={() => {}} height="" disabled />
        </NewPostSection>
      </PostsContainer>
    </DashboardLayout>
  );
}

export default Posts;
