"use client";

import { DashboardLayout } from "@/components/Layout";

import PostFeed from "./PostFeed";
import { PostsContainer } from "./styles";

export function Posts() {
  return (
    <DashboardLayout>
      <PostsContainer>
        <PostFeed />
      </PostsContainer>
    </DashboardLayout>
  );
}

export default Posts;
