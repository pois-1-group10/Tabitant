import { Post } from "./post";
import { User } from "./user";

export type Comment = {
	id: number;
  user: User;
  post: Post;
  content: string;
  created_at: Date;
  good_count?: number;
  bad_count?: number;
	reply_count?: number;
};

export type CommentListParams = {
	post_id?: number;
	reply_to?: number;
};
