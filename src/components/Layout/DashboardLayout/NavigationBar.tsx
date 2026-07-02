import styled from "styled-components";

import { Paragraph } from "@/components/styled/text";
import { DashboardRoutes } from "@/config/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  BookOpenTextIcon,
  CalendarDotsIcon,
  HouseIcon,
  NotepadIcon,
  ShootingStarIcon,
  UserCheckIcon,
} from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { ElementType } from "react";
import { useTranslation } from "react-i18next";
import { NotificationBadge } from "./NotificationBadge";
import { UserRole } from "need4deed-sdk";

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: var(--dashboard-navigation-bar-container-width);
  top: 112px;
  left: 0;
  z-index: 1;
  gap: var(--dashboard-navigation-bar-gap);
  background-color: var(--color-orchid-subtle);
  border-top-right-radius: var(--dashboard-navigation-bar-border-radius);
  border-bottom-right-radius: var(--dashboard-navigation-bar-border-radius);
  padding: var(--dashboard-navigation-bar-padding);

  @media (max-width: 767px) {
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
    top: auto;
    bottom: 0;
    width: 100%;
    height: var(--dashboard-navigation-bar-mobile-height);
    gap: 4px;
    padding: 8px 4px;
    border-radius: var(--dashboard-navigation-bar-border-radius) var(--dashboard-navigation-bar-border-radius) 0 0;
    overflow-x: auto;
  }
`;

const Option = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--dashboard-navigation-bar-option-gap);
  cursor: pointer;
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
  const { t } = useTranslation();
  const router = useRouter();
  const currentPathname = usePathname();
  const user = useCurrentUser();
  const canSeeCalendar = user?.role !== UserRole.AGENT;

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
    {
      label: t("dashboard.home.sidebar.volunteers"),
      Icon: UserCheckIcon,
      route: DashboardRoutes.Volunteers,
    },
    {
      label: t("dashboard.home.sidebar.opportunities"),
      Icon: ShootingStarIcon,
      route: DashboardRoutes.Opportunities,
    },
    {
      label: t("dashboard.home.sidebar.agents"),
      Icon: BookOpenTextIcon,
      route: DashboardRoutes.Agents,
    },
    {
      label: t("dashboard.home.sidebar.posts"),
      Icon: NotepadIcon,
      route: DashboardRoutes.Posts,
    },
    ...(canSeeCalendar
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

  return (
    <BarContainer>
      {options.map(({ label, Icon, text, route }) => {
        const isSelected = currentPathname.startsWith(route);

        return (
          <Option
            key={label}
            onClick={() => {
              router.push(route);
            }}
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
    </BarContainer>
  );
}
