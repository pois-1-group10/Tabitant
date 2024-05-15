import React, { createContext, useState } from "react";
import { CommentAPI } from "../api/Comment";
import { Comment, CommentListParams } from "../types/comment";

type CommentListContextType = {
  comments: Comment[];
  loading: boolean;
  fetchComments: (params: CommentListParams) => Promise<void>;
};

export const CommentListContext = createContext({} as CommentListContextType);

export const CommentListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchComments = async (params: CommentListParams) => {
    setLoading(true);
    try {
      const commentData = await CommentAPI.fetchCommentList(params);
      setComments(commentData);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <CommentListContext.Provider value={{ comments, loading, fetchComments }}>
      {children}
    </CommentListContext.Provider>
  );
};
