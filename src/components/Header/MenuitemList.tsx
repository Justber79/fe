import Link from "next/link";

import MenuItem from "./MenuItem";
import { MenuItemType } from "@/types";
import { eventsPublicLandingUrl } from "@/config/constants";

interface Props {
  items: MenuItemType[];
  menuItemColor?: string;
}

export default function MenuitemList({ items, menuItemColor }: Props) {
  return (
    <>
      {items.map(([label, linkUrl]) => (
        <Link
          href={linkUrl}
          key={label}
          target={linkUrl === eventsPublicLandingUrl ? "_blank" : "_self"}
          rel={linkUrl === eventsPublicLandingUrl ? "noopener noreferrer" : undefined}
        >
          <MenuItem text={label} color={menuItemColor} />
        </Link>
      ))}
    </>
  );
}
