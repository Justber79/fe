import Link from "next/link";

import MenuItem from "./MenuItem";
import { MenuItemType } from "@/types";

interface Props {
  items: MenuItemType[];
  menuItemColor?: string;
}

export default function MenuitemList({ items, menuItemColor }: Props) {
  return (
    <>
      {items.map(([label, linkUrl]) => (
        <Link href={linkUrl} key={label}>
          <MenuItem text={label} color={menuItemColor} />
        </Link>
      ))}
    </>
  );
}
