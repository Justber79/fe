"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/core/button";
import { EditableField } from "@/components/EditableField/EditableField";
import { DashboardLayout } from "@/components/Layout";

import PostFeed from "./PostFeed";
import { NewPostSection, PostsContainer } from "./styles";

export function Posts() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <PostsContainer>
        <PostFeed />
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
