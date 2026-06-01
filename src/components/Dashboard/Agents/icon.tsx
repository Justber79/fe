import { CalendarDotsIcon, MapPinIcon, ShootingStarIcon, HandPalmIcon } from "@phosphor-icons/react";
import { JSX } from "react";

export enum IconName {
  ShootingStar = "shootingStar",
  CalendarDots = "calendarDots",
  MapPin = "mapPin",
  HandPalmIcon = "handPalm",
}

type IconMap = {
  [key in IconName]: JSX.Element;
};

export const iconNameMap: IconMap = {
  [IconName.ShootingStar]: <ShootingStarIcon />,
  [IconName.CalendarDots]: <CalendarDotsIcon />,
  [IconName.MapPin]: <MapPinIcon />,
  [IconName.HandPalmIcon]: <HandPalmIcon />,
};
