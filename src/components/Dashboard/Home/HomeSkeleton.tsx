import { Heading3 } from "@/components/styled/text";
import React from "react";
import { useTranslation } from "react-i18next";

export function HomeSkeleton() {
  const { t } = useTranslation();
  return <Heading3>{t("dashboard.home.content.loading")}</Heading3>;
}
