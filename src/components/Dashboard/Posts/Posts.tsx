"use client";

import { DashboardLayout } from "@/components/Layout";

import PostFeed from "./PostFeed";
import PostComposer from "./PostComposer";
import { PostsContainer } from "./styles";

export function Posts() {
  return (
    <DashboardLayout>
      <PostsContainer>
        <PostFeed />
        <PostComposer />
      </PostsContainer>
    </DashboardLayout>
  );
}

export default Posts;
