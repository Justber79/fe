"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { StyledLink } from "../styles";

export function CreateOpportunityButton() {
  const user = useCurrentUser(true);
  const { t, i18n } = useTranslation();

  if (user?.role !== UserRole.AGENT) return null;

  return (
    <StyledLink href={`/${i18n.language}/dashboard/opportunities/new`}>
      + {t("dashboard.home.createOpportunity")}
    </StyledLink>
  );
}
