"use client";

import { DashboardRoutes } from "@/config/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const NAV_ITEMS = [
  { route: DashboardRoutes.AdminDomains, labelKey: "dashboard.admin.nav.domains" },
  { route: DashboardRoutes.AdminStatistics, labelKey: "dashboard.admin.nav.stats" },
];

export function AdminNav() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();

  return (
    <Nav aria-label={t("dashboard.admin.title")}>
      {NAV_ITEMS.map(({ route, labelKey }) => {
        const href = `/${i18n.language}${route}`;
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <NavLink key={route} href={href} aria-current={isActive ? "page" : undefined} $isActive={isActive}>
            {t(labelKey)}
          </NavLink>
        );
      })}
    </Nav>
  );
}

export default AdminNav;

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  padding: var(--spacing-8) var(--spacing-16);
  border-radius: var(--button-border-radius);
  border: 1px solid var(--color-orchid);
  background: ${({ $isActive }) => ($isActive ? "var(--color-orchid)" : "transparent")};
  color: var(--color-midnight);
  font-size: var(--text-p-font-size);
  font-weight: var(--font-weight-semi-bold);
  text-decoration: none;

  &:hover {
    background: var(--color-orchid-subtle);
  }
`;
