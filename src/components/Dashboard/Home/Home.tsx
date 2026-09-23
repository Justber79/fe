"use client";

import { DashboardLayout } from "@/components/Layout";
import { HomeContainer } from "./styles";
import HomeContentController from "./HomeContentController";

export function DashboardHome() {
  return (
    <DashboardLayout>
      <HomeContainer>
        <HomeContentController />
      </HomeContainer>
    </DashboardLayout>
  );
}

export default DashboardHome;
