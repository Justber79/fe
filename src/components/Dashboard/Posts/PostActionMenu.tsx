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

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
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
