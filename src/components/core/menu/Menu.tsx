"use client";

import { useClickOutside } from "@/hooks";
import React, { createContext, useContext, useRef, useState, useCallback, type ReactNode } from "react";
import styled from "styled-components";

interface MenuContextType {
  isOpen: boolean;
  selectItem: (onSelect: () => void) => void;
  close: () => void;
  toggle: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const useMenuContext = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error("Menu compound components must be used within <Menu>");
  }
  return ctx;
};

const Container = styled.div`
  position: relative;
  display: inline-flex;
`;

const TargetButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  color: inherit;
`;

const DropdownDiv = styled.div<{ $align: "left" | "right" }>`
  position: absolute;
  top: 100%;
  ${({ $align }) => ($align === "right" ? "right: 0;" : "left: 0;")}
  z-index: 10;
  margin: var(--spacing-4) 0 0;
  padding: var(--spacing-8) 0;
  background: var(--color-white);
  border-radius: var(--border-radius-xs);
  box-shadow: var(--dropdown-box-shadow);
  min-width: 140px;
`;

const ItemButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  padding: var(--spacing-12);
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  white-space: nowrap;

  &:hover {
    background-color: var(--color-grey-50);
  }
`;

const sizeMap = {
  s: { fontSize: "var(--font-size-14)", lineHeight: "var(--line-height-20)" },
  m: { fontSize: "var(--font-size-16)", lineHeight: "var(--line-height-24)" },
  l: { fontSize: "var(--font-size-24)", lineHeight: "var(--line-height-32)" },
  xl: { fontSize: "var(--font-size-32)", lineHeight: "var(--line-height-40)" },
} as const;

const fwMap = {
  regular: "var(--font-weight-regular)",
  semibold: "var(--font-weight-semibold)",
  bold: "var(--font-weight-bold)",
} as const;

const ItemTextStyled = styled.span<{ $size: keyof typeof sizeMap; $fw: keyof typeof fwMap }>`
  font-size: ${({ $size }) => sizeMap[$size].fontSize};
  line-height: ${({ $size }) => sizeMap[$size].lineHeight};
  letter-spacing: var(--letter-spacing-tight);
  font-weight: ${({ $fw }) => fwMap[$fw]};
  color: var(--color-blue-700);
`;

function ItemText({
  children,
  size = "m",
  fw = "regular",
}: {
  children: ReactNode;
  size?: keyof typeof sizeMap;
  fw?: keyof typeof fwMap;
}) {
  return (
    <ItemTextStyled $size={size} $fw={fw}>
      {children}
    </ItemTextStyled>
  );
}

interface MenuProps {
  children: ReactNode;
  closeOnSelect?: boolean;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

function Menu({ children, closeOnSelect = true, open, onOpen, onClose }: MenuProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? open : internalOpen;

  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalOpen(false);
      onClose?.();
    }
  }, [isControlled, onClose]);

  const toggle = useCallback(() => {
    const next = !isOpen;
    if (isControlled) {
      if (next) onOpen?.();
      else onClose?.();
    } else {
      setInternalOpen(next);
      if (next) onOpen?.();
      else onClose?.();
    }
  }, [isControlled, isOpen, onOpen, onClose]);

  const selectItem = useCallback(
    (onSelect: () => void) => {
      onSelect();
      if (closeOnSelect) {
        if (isControlled) {
          onClose?.();
        } else {
          setInternalOpen(false);
          onClose?.();
        }
      }
    },
    [closeOnSelect, isControlled, onClose],
  );

  useClickOutside(ref, close);

  return (
    <MenuContext.Provider value={{ isOpen, selectItem, close, toggle }}>
      <Container ref={ref}>{children}</Container>
    </MenuContext.Provider>
  );
}

function Target({ children }: { children: ReactNode }) {
  const { toggle } = useMenuContext();

  return (
    <TargetButton
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
    >
      {children}
    </TargetButton>
  );
}

interface DropdownProps {
  children: ReactNode;
  align?: "left" | "right";
}

function Dropdown({ children, align = "left" }: DropdownProps) {
  const { isOpen } = useMenuContext();

  if (!isOpen) return null;

  return (
    <DropdownDiv $align={align} role="menu">
      {children}
    </DropdownDiv>
  );
}

interface ItemProps {
  children: ReactNode;
  onSelect: () => void;
}

function Item({ children, onSelect }: ItemProps) {
  const { selectItem } = useMenuContext();

  return (
    <ItemButton
      role="menuitem"
      onClick={(e) => {
        e.stopPropagation();
        selectItem(onSelect);
      }}
    >
      {children}
    </ItemButton>
  );
}

Menu.Target = Target;
Menu.Dropdown = Dropdown;
Menu.Item = Item;

export { Menu, ItemText };
