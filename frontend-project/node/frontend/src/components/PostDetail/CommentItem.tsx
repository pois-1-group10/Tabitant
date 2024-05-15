/** @jsxImportSource @emotion/react */

import React, { useState } from "react";
import { css } from "@emotion/react";

import thumbUpIcon from "../../img/thumb_up.svg";
import thumbDownIcon from "../../img/thumb_down.svg";
import { Comment } from "../../types/comment";
import ReplyList from "./ReplyList";
import { CommentListProvider } from "../../providers/CommentListProvider";

interface Props {
  comment: Comment;
}

export default function CommentItem({ comment }: Props) {
  const [showReplies, setShowReplies] = useState<boolean>(false);

  return (
    <>
      <div css={wrapperStyle}>
        <img src="" alt="" css={iconStyle} />
        <div css={contentWrapperStyle}>
          <div css={commenterNameStyle}>
            {comment.user.username}
            <span>{new Date(comment.created_at).toLocaleString()}</span>
          </div>
          <p>{comment.content}</p>
          <div css={commentFooterStyle}>
            <div>
              <img src={thumbUpIcon} alt="" />
              <div css={thumbCountStyle}>{comment.good_count ?? 0}</div>
            </div>
            <div>
              <img src={thumbDownIcon} alt="" />
              <div css={thumbCountStyle}>{comment.bad_count ?? 0}</div>
            </div>
            {showReplies || (
              <div css={replyOpenerStyle} onClick={() => setShowReplies(true)}>
                {comment.reply_count}件の返信
              </div>
            )}
          </div>
        </div>
      </div>
      {showReplies && (
        <CommentListProvider>
          <ReplyList parentCommentId={comment.id} />
        </CommentListProvider>
      )}
    </>
  );
}

const wrapperStyle = css`
  display: flex;
  gap: 8px;
  margin: 8px 0;
`;

const iconStyle = css`
  width: 32px;
  height: 32px;
  border-radius: 20px;
  border: 1px solid #303030;
`;

const contentWrapperStyle = css`
  flex-grow: 1;
  text-align: left;
  p {
    margin: 4px 0;
  }
`;

const commenterNameStyle = css`
  color: #767878;
  font-size: 12px;
`;

const commentFooterStyle = css`
  display: flex;
	gap: 24px;
  justify-content: left;
  align-items: center;
  text-align: center;
`;

const thumbCountStyle = css`
  font-size: 12px;
`;

const replyOpenerStyle = css`
  color: #ff981f;
  font-size: 14px;
`;
