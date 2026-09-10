import { ListIcon } from "@phosphor-icons/react";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { DashboardRoutes, eventsPublicLandingUrl, opportunityCardsPublicUrl } from "@/config/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MenuItemType, Subpage } from "@/types";
import { UserRole } from "need4deed-sdk";
import BurgerMenuItems from "./BurgerMenuItems";
import LoginRegister from "./LoginRegister";
import MenuItems from "./MenuItems";
import UserProfile from "./UserProfile";
import MenuItem from "./MenuItem";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderContainerProps {
  height?: string;
  padding?: string;
}

const HeaderContainer = styled.div<HeaderContainerProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${(props) => props.height || "auto"};
  padding: ${(props) => props.padding};
  position: fixed;
  z-index: 1;
  top: 0;
  background-color: var(--color-orchid-subtle);
  width: -webkit-fill-available;
  gap: var(--space-sm);
  box-sizing: border-box;

  @media (max-width: 767px) {
    gap: 8px;

    > svg {
      width: 96px;
      height: auto;
      flex-shrink: 0;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  @media (max-width: 767px) {
    gap: 4px;
    min-width: 0;
  }
`;

const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
`;

const DashboardLink = styled(Link)`
  text-decoration: none;
`;

interface Props {
  logo: ReactNode;
  isBurgerMenu?: boolean;
  height?: string;
  padding?: string;
  menuItemColor: string;
  burgerMenuItemColor?: string;
}

export function Header({
  logo,
  isBurgerMenu,
  height,
  padding,
  menuItemColor,
  burgerMenuItemColor = "var(--color-midnight)",
}: Props) {
  const { t, i18n } = useTranslation();
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState<boolean>(false);
  const user = useCurrentUser();

  const isAgent = user?.role === UserRole.AGENT;

  const menuItems: MenuItemType[] = [
    [t("homepage.heroSection.menuItems.about"), `/${Subpage.ABOUT}`],
    [
      t("homepage.heroSection.menuItems.volunteeringOpportunities"),
      isAgent ? opportunityCardsPublicUrl : `${DashboardRoutes.Opportunities}?view=cards`,
    ],
    [t("homepage.heroSection.menuItems.events"), `/${i18n.language}${eventsPublicLandingUrl}`],
  ];

  return (
    <HeaderContainer id="header-container" height={height} padding={padding}>
      {logo}

      {!isBurgerMenu && <MenuItems items={menuItems} menuItemColor={menuItemColor} />}

      <HeaderActions>
        <LanguageSwitcher textColor={menuItemColor} />
        {user && (
          <DashboardLink href={`/${i18n.language}/dashboard`}>
            <MenuItem text={t("dashboard.header.button.dashboard")} color={menuItemColor} />
          </DashboardLink>
        )}
        {user ? <UserProfile /> : <LoginRegister />}
        {isBurgerMenu && (
          <MenuButton
            type="button"
            aria-label={t("homepage.heroSection.menuItems.openMenu", { defaultValue: "Open menu" })}
            aria-expanded={isBurgerMenuOpen}
            onClick={() => setIsBurgerMenuOpen(true)}
          >
            <ListIcon size={32} color={menuItemColor} />
          </MenuButton>
        )}
      </HeaderActions>

      {isBurgerMenu && isBurgerMenuOpen && (
        <BurgerMenuItems
          isOpen={isBurgerMenuOpen}
          setIsOpen={setIsBurgerMenuOpen}
          items={menuItems}
          menuItemColor={burgerMenuItemColor}
        />
      )}
    </HeaderContainer>
  );
}

export default Header;
