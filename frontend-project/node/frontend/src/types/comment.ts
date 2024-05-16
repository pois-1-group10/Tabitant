import { User } from "./user";

export type Comment = {
	id: number;
  user: User;
  post: number;
  content: string;
  created_at: Date;
  good_count?: number;
  bad_count?: number;
	reply_count?: number;
	liked: boolean;
	disliked: boolean;
};

export type CommentListParams = {
	post_id?: number;
	reply_to?: number;
};

export type PostCommentData = {
	post: number;
	parent_comment?: number;
	user: number;
	content: string;
};
