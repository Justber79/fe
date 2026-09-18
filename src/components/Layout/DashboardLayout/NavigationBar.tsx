import styled from "styled-components";

import { Paragraph } from "@/components/styled/text";
import { DashboardRoutes } from "@/config/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  BookOpenTextIcon,
  CalendarDotsIcon,
  DotsThreeCircleIcon,
  HouseIcon,
  NotepadIcon,
  ShootingStarIcon,
  UserCheckIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ElementType, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NotificationBadge } from "./NotificationBadge";
import { UserRole } from "need4deed-sdk";

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  width: var(--dashboard-navigation-bar-container-width);
  top: 112px;
  left: 0;
  z-index: 0;
  gap: var(--dashboard-navigation-bar-gap);
  background-color: var(--color-orchid-subtle);
  border-top-right-radius: var(--dashboard-navigation-bar-border-radius);
  border-bottom-right-radius: var(--dashboard-navigation-bar-border-radius);
  padding: var(--dashboard-navigation-bar-padding);

  @media (max-width: 767px) {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    position: fixed;
    top: unset;
    bottom: 0;
    z-index: 20;
    width: 100%;
    height: var(--dashboard-navigation-bar-mobile-height);
    box-sizing: border-box;
    gap: 6px;
    padding: 8px 12px;
    border-radius: var(--dashboard-navigation-bar-border-radius) var(--dashboard-navigation-bar-border-radius) 0 0;
    pointer-events: auto;
  }
`;

const NavigationWrapper = styled.div`
  @media (max-width: 767px) {
    position: fixed;
    z-index: 21;
    right: 0;
    bottom: 0;
    left: 0;
    height: var(--dashboard-navigation-bar-mobile-height);
    pointer-events: none;
  }
`;

const MoreMenu = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: grid;
    position: absolute;
    z-index: 22;
    right: 12px;
    bottom: calc(var(--dashboard-navigation-bar-mobile-height) + 8px);
    left: 12px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--color-orchid-subtle);
    border-radius: var(--dashboard-navigation-bar-border-radius);
    background: var(--color-white);
    box-shadow: 0 8px 24px rgba(44, 33, 74, 0.2);
    pointer-events: auto;
  }
`;

const Option = styled(Link)<{ $hideOnMobile?: boolean; $mobileOrder?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--dashboard-navigation-bar-option-gap);
  cursor: pointer;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-family: inherit;
  text-decoration: none;

  @media (max-width: 767px) {
    display: ${({ $hideOnMobile }) => ($hideOnMobile ? "none" : "flex")};
    order: ${({ $mobileOrder }) => $mobileOrder};
    flex: 1 1 0;
    min-width: 0;
    padding: 0 6px;
  }
`;

const MoreButton = styled.button`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    order: 4;
    flex: 1 1 0;
    min-width: 0;
    flex-direction: column;
    justify-content: center;
    gap: var(--dashboard-navigation-bar-option-gap);
    padding: 0 6px;
    border: 0;
    background: transparent;
    color: inherit;
    font-family: inherit;
    cursor: pointer;
  }
`;

const MoreMenuOption = styled(Option)`
  @media (max-width: 767px) {
    min-width: 72px;
    min-height: 72px;
    padding: 8px 4px;
    border-radius: var(--button-border-radius);
    background: var(--color-orchid-subtle);
  }
`;

interface IconDivProps {
  $isSelected: boolean;
}

const IconDiv = styled.div<IconDivProps>`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  width: var(--dashboard-navigation-bar-option-icon-div-size);
  height: var(--dashboard-navigation-bar-option-icon-div-size);
  border-radius: var(--dashboard-navigation-bar-option-icon-div-size);
  background-color: var(--color-orchid);
  margin: auto;
  background-color: ${({ $isSelected }) => ($isSelected ? "var(--color-midnight)" : "var(--color-orchid)")};
`;

interface StyledParagraphProps {
  label: string;
  isSelected?: boolean;
}

const StyledParagraph = ({ label, isSelected }: StyledParagraphProps) => {
  return (
    <NavLabel
      color={isSelected ? "var(--color-orchid)" : "var(--color-midnight)"}
      fontSize="var(--dashboard-navigation-bar-option-text-size)"
      fontWeight="var(--dashboard-navigation-bar-option-text-weight)"
      letterSpacing="var(--dashboard-navigation-bar-option-text-letter-spacing)"
      lineheight="var(--dashboard-navigation-bar-option-text-size)"
      margin="auto"
    >
      {label}
    </NavLabel>
  );
};

const NavLabel = styled(Paragraph)`
  text-align: center;
  overflow-wrap: break-word;
  word-break: break-word;
  width: 100%;
`;

interface BarOptions {
  label: string;
  Icon?: ElementType;
  route: DashboardRoutes;
  text?: string;
}

export default function NavigationBar() {
  const { t, i18n } = useTranslation();
  const currentPathname = usePathname();
  const user = useCurrentUser();
  const isAgent = user?.role === UserRole.AGENT;
  const isVolunteer = user?.role === UserRole.VOLUNTEER;
  const canSeeStaffNav = !isAgent && !isVolunteer;
  const navigationRef = useRef<HTMLDivElement>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const userInitials = user?.fullName
    ? user.fullName
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.firstName?.[0]?.toUpperCase() || "";

  const options: BarOptions[] = [
    { label: t("dashboard.home.sidebar.home"), Icon: HouseIcon, route: DashboardRoutes.Home },
    ...(canSeeStaffNav
      ? [
          {
            label: t("dashboard.home.sidebar.volunteers"),
            Icon: UserCheckIcon,
            route: DashboardRoutes.Volunteers,
          },
        ]
      : []),
    {
      label: t("dashboard.home.sidebar.opportunities"),
      Icon: ShootingStarIcon,
      route: DashboardRoutes.Opportunities,
    },
    ...(isVolunteer
      ? []
      : [
          {
            label: t("dashboard.home.sidebar.agents"),
            Icon: BookOpenTextIcon,
            route: DashboardRoutes.Agents,
          },
        ]),
    ...(isVolunteer
      ? []
      : [
          {
            label: t("dashboard.home.sidebar.posts"),
            Icon: NotepadIcon,
            route: DashboardRoutes.Posts,
          },
        ]),
    ...(canSeeStaffNav
      ? [
          {
            label: t("dashboard.home.sidebar.calendar"),
            Icon: CalendarDotsIcon,
            route: DashboardRoutes.Calendar,
          },
        ]
      : []),
    {
      label: t("dashboard.home.sidebar.profile"),
      text: userInitials,
      route: DashboardRoutes.Profile,
    },
  ];

  const coordinatorPrimaryRoutes = [
    DashboardRoutes.Home,
    DashboardRoutes.Volunteers,
    DashboardRoutes.Opportunities,
    DashboardRoutes.Posts,
  ];
  const hasMoreMenu = canSeeStaffNav;
  const moreOptions = hasMoreMenu ? options.filter(({ route }) => !coordinatorPrimaryRoutes.includes(route)) : [];
  const moreIsSelected = moreOptions.some(({ route }) => {
    const localizedRoute = `/${i18n.language}${route}`;
    return currentPathname === localizedRoute || currentPathname.startsWith(`${localizedRoute}/`);
  });
  const closeMoreMenu = useCallback(() => setIsMoreOpen(false), []);

  useEffect(() => {
    if (!isMoreOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!navigationRef.current?.contains(event.target as Node)) closeMoreMenu();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMoreMenu();
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeMoreMenu, isMoreOpen]);

  return (
    <NavigationWrapper ref={navigationRef}>
      {isMoreOpen && (
        <MoreMenu>
          {moreOptions.map(({ label, Icon, text, route }) => {
            const localizedRoute = `/${i18n.language}${route}`;
            const isSelected = currentPathname === localizedRoute || currentPathname.startsWith(`${localizedRoute}/`);
            return (
              <MoreMenuOption
                href={localizedRoute}
                aria-current={isSelected ? "page" : undefined}
                aria-label={label}
                key={label}
                onClick={closeMoreMenu}
              >
                <IconDiv $isSelected={isSelected}>
                  {(Icon && <Icon size={24} color={isSelected ? "var(--color-orchid)" : "var(--color-midnight)"} />) ||
                    (text && <StyledParagraph isSelected={isSelected} label={text} />)}
                </IconDiv>
                <StyledParagraph isSelected={isSelected} label={label} />
              </MoreMenuOption>
            );
          })}
        </MoreMenu>
      )}
      <BarContainer>
        {options.map(({ label, Icon, text, route }, index) => {
          const localizedRoute = `/${i18n.language}${route}`;
          const isSelected =
            currentPathname === localizedRoute ||
            (route !== DashboardRoutes.Home && currentPathname.startsWith(`${localizedRoute}/`));
          const mobileOrder = hasMoreMenu ? coordinatorPrimaryRoutes.indexOf(route) : index;

          return (
            <Option
              $hideOnMobile={hasMoreMenu && mobileOrder === -1}
              $mobileOrder={mobileOrder}
              href={localizedRoute}
              aria-current={isSelected ? "page" : undefined}
              aria-label={label}
              key={label}
            >
              <IconDiv $isSelected={isSelected}>
                {label === t("dashboard.home.sidebar.home") && <NotificationBadge />}
                {(Icon && <Icon size={24} color={isSelected ? "var(--color-orchid)" : "var(--color-midnight)"} />) ||
                  (text && <StyledParagraph isSelected={isSelected} label={text} />)}
              </IconDiv>
              <StyledParagraph label={label} />
            </Option>
          );
        })}
        {hasMoreMenu && (
          <MoreButton
            type="button"
            aria-expanded={isMoreOpen}
            aria-label={t("dashboard.home.sidebar.more")}
            onClick={() => setIsMoreOpen((isOpen) => !isOpen)}
          >
            <IconDiv $isSelected={moreIsSelected || isMoreOpen}>
              <DotsThreeCircleIcon
                size={24}
                color={moreIsSelected || isMoreOpen ? "var(--color-orchid)" : "var(--color-midnight)"}
              />
            </IconDiv>
            <StyledParagraph isSelected={moreIsSelected} label={t("dashboard.home.sidebar.more")} />
          </MoreButton>
        )}
      </BarContainer>
    </NavigationWrapper>
  );
}
