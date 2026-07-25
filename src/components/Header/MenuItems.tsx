import styled from "styled-components";

import MenuitemList from "./MenuitemList";
import { MenuItemType } from "@/types";

const DesktopMenuItemsContainer = styled.div`
  display: flex;
  align-items: center;
  height: fit-content;
  gap: var(--homepage-hero-section-header-menu-items-gap);
  a {
    text-decoration: none;
  }
`;

interface Props {
  items: MenuItemType[];
  menuItemColor: string;
}

export default function MenuItems({ items, menuItemColor }: Props) {
  return (
    <DesktopMenuItemsContainer>
      <MenuitemList items={items} menuItemColor={menuItemColor} />
    </DesktopMenuItemsContainer>
  );
}
