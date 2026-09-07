export interface ReplyTarget {
  postId: number;
  parentReplyId?: number;
  authorName: string;
  createdAt: Date;
  text: string;
}
