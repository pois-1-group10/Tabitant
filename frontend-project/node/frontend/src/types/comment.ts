import { Post } from "./post";
import { User } from "./user";

export type Comment = {
    user: User;
    post: Post;
    content: string;
    created_at: Date;
    good_count?: number;
    bad_count?: number;
};
