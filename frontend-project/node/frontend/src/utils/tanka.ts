import { Post } from "../types/post";

export const tankaFromPost = (post: Post) => {
  return [
    post.content_1,
    post.content_2,
    post.content_3,
    post.content_4,
    post.content_5,
  ].join(" ");
};
