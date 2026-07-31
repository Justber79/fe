import {
  BabyIcon,
  BicycleIcon,
  CalendarStarIcon,
  ChartLineIcon,
  ChatCircleDotsIcon,
  ChatsCircleIcon,
  ChatsTeardropIcon,
  ClipboardTextIcon,
  GiftIcon,
  HouseIcon,
  PingPongIcon,
  ShootingStarIcon,
  SparkleIcon,
  TrashIcon,
  UserCheckIcon,
  UserCircleIcon,
  UsersIcon,
  UsersThreeIcon,
  WrenchIcon,
} from "@phosphor-icons/react";
import { JSX } from "react";
import { IconName } from "../types";

type IconMap = {
  [key in IconName]: JSX.Element;
};

export const iconNameMap: IconMap = {
  [IconName.Baby]: <BabyIcon />,
  [IconName.Bicycle]: <BicycleIcon />,
  [IconName.CalendarStar]: <CalendarStarIcon />,
  [IconName.ChartLine]: <ChartLineIcon />,
  [IconName.ChatCircleDots]: <ChatCircleDotsIcon />,
  [IconName.ChatsCircle]: <ChatsCircleIcon />,
  [IconName.ChatsTeardrop]: <ChatsTeardropIcon />,
  [IconName.ClipboardText]: <ClipboardTextIcon />,
  [IconName.Gift]: <GiftIcon />,
  [IconName.House]: <HouseIcon />,
  [IconName.PingPong]: <PingPongIcon />,
  [IconName.ShootingStar]: <ShootingStarIcon />,
  [IconName.Sparkle]: <SparkleIcon />,
  [IconName.Trash]: <TrashIcon />,
  [IconName.UserCheck]: <UserCheckIcon />,
  [IconName.UserCircle]: <UserCircleIcon />,
  [IconName.Users]: <UsersIcon />,
  [IconName.UsersThree]: <UsersThreeIcon />,
  [IconName.Wrench]: <WrenchIcon />,
};
