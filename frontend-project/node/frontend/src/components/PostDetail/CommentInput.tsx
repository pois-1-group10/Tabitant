/** @jsxImportSource @emotion/react */

import React, { useContext } from "react";
import { css } from "@emotion/react";
import { useForm } from "react-hook-form";
import { CommentAPI } from "../../api/Comment";
import { AuthUserContext } from "../../providers/AuthUserProvider";
import { CommentListContext } from "../../providers/CommentListProvider";

interface Props {
  postId: number;
  replyTo?: number;
}

type Input = {
  content: string;
};

export default function CommentInput({ postId, replyTo }: Props) {
  const { register, handleSubmit, reset } = useForm<Input>();
  const { currentUser } = useContext(AuthUserContext);
  const { fetchComments } = useContext(CommentListContext);

  const onSubmit = async (data: Input) => {
    try {
      currentUser &&
        postId &&
        (await CommentAPI.createComment({
          post: postId,
          user: currentUser.id,
          parent_comment: replyTo,
          content: data.content,
        }));
      reset();
      await fetchComments({
        post_id: postId,
		reply_to: replyTo,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} css={inputWrapperStyle}>
      <input
        {...register("content")}
        type="text"
        placeholder={replyTo ? "返信をする" : "コメントをする"}
        css={inputStyle}
      />
      <button type="submit" css={submitButtonStyle}>
        送信
      </button>
    </form>
  );
}

const inputWrapperStyle = css`
  display: flex;
  flex-grow: 1;
  height: 32px;
  padding: 0 12px;
  background-color: #d9d9d9;
  border-radius: 16px;
  font-size: 16px;
`;

const inputStyle = css`
  border: none;
  background-color: transparent;
  flex-grow: 1;
  &:focus {
    outline: none;
  }
`;

const submitButtonStyle = css`
  border: none;
  background: none;
  appearance: none;
  font-weight: bold;
`;
