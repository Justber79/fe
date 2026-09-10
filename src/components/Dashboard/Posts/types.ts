export interface ReplyTarget {
  targetKey: string;
  postId: number;
  parentReplyId?: number;
  authorName: string;
  createdAt: Date;
  text: string;
}
