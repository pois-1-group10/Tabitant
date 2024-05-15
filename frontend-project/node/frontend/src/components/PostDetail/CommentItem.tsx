/** @jsxImportSource @emotion/react */

import React, { useState } from "react";
import { css } from "@emotion/react";

import { Comment } from "../../types/comment";
import ReplyList from "./ReplyList";
import { CommentListProvider } from "../../providers/CommentListProvider";
import { CommentAPI } from "../../api/Comment";
import { BadButton, GoodButton } from "./ReactionButtons";
import { Link } from "react-router-dom";

interface Props {
  comment: Comment;
}

export default function CommentItem({ comment }: Props) {
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [goodIsClicked, setGoodIsClicked] = useState<boolean | undefined>(
    comment.liked
  );
  const [badIsClicked, setBadIsClicked] = useState<boolean | undefined>(
    comment.disliked
  );
  const [goodCount, setGoodCount] = useState<number | undefined>(
    comment.good_count
  );
  const [badCount, setBadCount] = useState<number | undefined>(
    comment.bad_count
  );

  const goodClickHandler = async () => {
    if (goodIsClicked) {
      await CommentAPI.unlike(comment.id);
      setGoodIsClicked(false);
      goodCount !== undefined && setGoodCount(goodCount - 1);
    } else {
      await CommentAPI.like(comment.id);
      setGoodIsClicked(true);
      goodCount !== undefined && setGoodCount(goodCount + 1);
    }
    if (badIsClicked) {
      setBadIsClicked(false);
      badCount !== undefined && setBadCount(badCount - 1);
    }
  };

  const badClickHandler = async () => {
    if (goodIsClicked) {
      setGoodIsClicked(false);
      goodCount !== undefined && setGoodCount(goodCount - 1);
    }
    if (badIsClicked) {
      await CommentAPI.undislike(comment.id);
      setBadIsClicked(false);
      badCount !== undefined && setBadCount(badCount - 1);
    } else {
      await CommentAPI.dislike(comment.id);
      setBadIsClicked(true);
      badCount !== undefined && setBadCount(badCount + 1);
    }
  };

  return (
    <>
      <div css={wrapperStyle}>
        <img src="" alt="" css={iconStyle} />
        <div css={contentWrapperStyle}>
          <div css={commenterNameStyle}>
            <Link to={`/user_profile/${comment.user.id}`}>
              {comment.user.username}
            </Link>
            <span>{new Date(comment.created_at).toLocaleString()}</span>
          </div>
          <p>{comment.content}</p>
          <div css={commentFooterStyle}>
            <GoodButton
              checked={goodIsClicked}
              count={goodCount ?? 0}
              onClick={goodClickHandler}
            />
            <BadButton
              checked={badIsClicked}
              count={badCount ?? 0}
              onClick={badClickHandler}
            />
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
	a {
		color: initial;
		font-weight: bold;
		text-decoration: none;
	}
	span {
		margin-left: 8px;
	}
`;

const commentFooterStyle = css`
  display: flex;
  gap: 24px;
  justify-content: left;
  align-items: center;
  text-align: center;
`;

const replyOpenerStyle = css`
  color: #ff981f;
  font-size: 14px;
`;
