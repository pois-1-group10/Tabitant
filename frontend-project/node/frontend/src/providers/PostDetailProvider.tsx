import React, { createContext, useState } from "react";
import { Post } from "../types/post";
import { PostAPI } from "../api/Post";
import { useParams } from "react-router-dom";

type PostDetailContextType = {
  post?: Post;
  loading: boolean;
  fetchPostDetail: (id?: number) => Promise<void>;
};

export const PostDetailContext = createContext({} as PostDetailContextType);

export const PostDetailProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [post, setPost] = useState<Post | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();
  const userId = Number(params.id);

  const fetchPostDetail = async (id?: number) => {
    setLoading(true);
    try {
      const postData = await PostAPI.fetchPostDetail(id ?? userId);
      setPost(postData);
    } catch (e) {
      console.log(e);
    }
	setLoading(false);
  };

  return (
    <PostDetailContext.Provider value={{ post, loading, fetchPostDetail }}>
      {children}
    </PostDetailContext.Provider>
  );
};
