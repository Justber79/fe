import { formatDateTime } from "@/utils";
import { TimedText } from "need4deed-sdk";
import { CommentDisplay } from "./CommentDisplay";
import { CommentEdit } from "./CommentEdit";
import { AuthorName, CommentContent, CommentItem, Timestamp, TopInfo } from "./styles";

type EditState = {
  isActive: boolean;
  text: string;
  canSave: boolean;
  isUpdating: boolean;
  onTextChange: (text: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
};

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
  comment: TimedText;
  edit: EditState;
  menu: MenuState;
};

export function Comment({ comment, edit, menu }: Props) {
  return (
    <CommentItem>
      <CommentContent>
        <TopInfo>
          <AuthorName>{comment.authorName}</AuthorName>
          <Timestamp>{formatDateTime(comment.timestamp)}</Timestamp>
        </TopInfo>
        {edit.isActive ? (
          <CommentEdit commentId={comment.id} edit={edit} />
        ) : (
          <CommentDisplay commentId={comment.id} content={comment.content} menu={menu} />
        )}
      </CommentContent>
    </CommentItem>
  );
}
