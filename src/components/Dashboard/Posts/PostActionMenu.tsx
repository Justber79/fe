import { useClickOutside } from "@/hooks";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { ActionMenu, ActionMenuItem } from "./styles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function PostActionMenu({ isOpen, onClose, onEdit, onDelete }: Props) {
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, onClose);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ActionMenu ref={menuRef} role="menu">
      <ActionMenuItem role="menuitem" onClick={onEdit}>
        {t("dashboard.posts.edit")}
      </ActionMenuItem>
      <ActionMenuItem role="menuitem" $danger onClick={onDelete}>
        {t("dashboard.posts.delete")}
      </ActionMenuItem>
    </ActionMenu>
  );
}

export default PostActionMenu;
