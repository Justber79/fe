"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "need4deed-sdk";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: var(--color-aubergine);
  color: var(--color-white);
  border: none;
  border-radius: var(--button-border-radius, 8px);
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  align-self: flex-start;

  &:hover {
    opacity: 0.88;
  }
`;

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
