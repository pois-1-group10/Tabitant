/** @jsxImportSource @emotion/react */

import React, { FC, useContext, useEffect } from "react";
import { css } from "@emotion/react";

import thumbUpIcon from "../../img/thumb_up.svg";
import thumbDownIcon from "../../img/thumb_down.svg";
import { Comment } from "../../types/comment";
import { CommentListContext } from "../../providers/CommentListProvider";

interface Props {
  parentCommentId: number;
}

export default function ReplyList({ parentCommentId }: Props) {
  const { comments: replies, fetchComments } = useContext(CommentListContext);

  useEffect(() => {
    fetchComments({ reply_to: parentCommentId });
  }, []);

  return (
    <div>
      {replies.map((reply) => (
        <ReplyItem key={reply.id} reply={reply} />
      ))}
    </div>
  );
}

interface InnerProps {
  reply: Comment;
}

const ReplyItem: FC<InnerProps> = ({ reply }) => {
  return (
    <div css={wrapperStyle}>
      <img src="" alt="" css={iconStyle} />
      <div css={contentWrapperStyle}>
        <div css={commenterNameStyle}>
          {reply.user.username}
          <span>{new Date(reply.created_at).toLocaleString()}</span>
        </div>
        <p>{reply.content}</p>
        <div css={commentFooterStyle}>
          <div>
            <img src={thumbUpIcon} alt="" />
            <div css={thumbCountStyle}>{reply.good_count ?? 0}</div>
          </div>
          <div>
            <img src={thumbDownIcon} alt="" />
            <div css={thumbCountStyle}>{reply.bad_count ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const wrapperStyle = css`
  display: flex;
  gap: 8px;
  margin: 8px 0 8px 32px;
`;

const iconStyle = css`
  width: 24px;
  height: 24px;
  border-radius: 20px;
  border: 1px solid #303030;
`;

const contentWrapperStyle = css`
  flex-grow: 1;
  text-align: left;
  p {
    margin: 4px 0;
    font-size: 14px;
  }
`;

const commenterNameStyle = css`
  color: #767878;
  font-size: 10px;
`;

const commentFooterStyle = css`
  display: flex;
  gap: 24px;
  justify-content: left;
  align-items: center;
  text-align: center;
  div {
    display: flex;
    gap: 4px;
  }
  img {
    height: 16px;
  }
`;

const thumbCountStyle = css`
  font-size: 12px;
`;

const replyOpenerStyle = css`
  color: #ff981f;
  font-size: 14px;
`;
