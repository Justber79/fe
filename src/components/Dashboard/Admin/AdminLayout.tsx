"use client";

import { DashboardLayout } from "@/components/Layout";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { HyphenatedHeading2 } from "../common/CardsHeader/styles";
import { AdminNav } from "./AdminNav";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <AdminContainer>
        <HeaderContainer>
          <HyphenatedHeading2>{t("dashboard.admin.title")}</HyphenatedHeading2>
          <AdminNav />
        </HeaderContainer>
        {children}
      </AdminContainer>
    </DashboardLayout>
  );
}

export default AdminLayout;

const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-volunteers-container-gap);
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--opportunities-header-title-tabs-gap);
`;
