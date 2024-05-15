import React, { createContext, useState } from "react";
import { Post, PostListParams } from "../types/post";
import { PostAPI } from "../api/Post";

type PostListContextType = {
  posts: Post[];
  loading: boolean;
  fetchPosts: (params: PostListParams) => Promise<void>;
};

export const PostListContext = createContext({} as PostListContextType);

export const PostListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPosts = async (params: PostListParams) => {
	setLoading(true);
    try {
      const postData = await PostAPI.fetchPostList(params);
	  setPosts(postData);
    } catch (e) {
      console.log(e);
    }
	setLoading(false);
  };

  return (
    <PostListContext.Provider value={{ posts, loading, fetchPosts }}>
      {children}
    </PostListContext.Provider>
  );
};
