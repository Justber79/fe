"use client";

import { Heading4 } from "@/components/styled/text";
import { ChartBarIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export function Statistics() {
  const { t } = useTranslation();

  return (
    <EmptyState>
      <ChartBarIcon size={48} color="var(--color-orchid)" />
      <Heading4 margin={0}>{t("dashboard.admin.stats.comingSoon")}</Heading4>
    </EmptyState>
  );
}

export default Statistics;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-16);
  min-height: var(--dashboard-home-container-min-height, 300px);
`;
