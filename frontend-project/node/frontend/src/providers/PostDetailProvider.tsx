import React, { createContext, useState } from "react";
import { Post } from "../types/post";

type PostDetailContextType = {
	post?: Post;
	loading: boolean;
	fetchPostDetail: (id: number) => Promise<void>;
}

export const PostDetailContext = createContext({} as PostDetailContextType);

export const PostDetailProvider = ({ children }: { children: React.ReactNode }) => {
  const [post, setPost] = useState<Post|undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPostDetail = async (id: number) => {};

	return (
    <PostDetailContext.Provider value={{post, loading, fetchPostDetail}} >
			{ children }
		</PostDetailContext.Provider>
  )
};
