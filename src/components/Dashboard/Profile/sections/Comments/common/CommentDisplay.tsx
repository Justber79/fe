import { DotsThreeOutline } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { CommentActionMenu } from "./CommentActionMenu";
import { CommentText, MenuAction } from "./styles";
import { useCommentTag } from "./hooks/useCommentTag";

type MenuState = {
  isOpen: boolean;
  anchorElement: HTMLButtonElement | null;
  buttonRef: (el: HTMLButtonElement | null) => void;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

type Props = {
  commentId: string | number;
  content: string;
  menu: MenuState;
};

export function CommentDisplay({ commentId, content, menu }: Props) {
  const { t } = useTranslation();
  const { renderHighlightedText } = useCommentTag(content);
  return (
    <>
      <CommentText>{renderHighlightedText()}</CommentText>
      <MenuAction
        ref={menu.buttonRef}
        onClick={menu.onToggle}
        aria-label={t("dashboard.commentsSection.menuAction")}
        data-testid={`comment-menu-${commentId}`}
      >
        <DotsThreeOutline size={24} weight="fill" />
      </MenuAction>
      <CommentActionMenu
        isOpen={menu.isOpen}
        onClose={menu.onClose}
        onEdit={menu.onEdit}
        onDelete={menu.onDelete}
        anchorElement={menu.anchorElement}
      />
    </>
  );
}
