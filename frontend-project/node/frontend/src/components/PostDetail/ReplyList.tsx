/** @jsxImportSource @emotion/react */

import React, { FC, useContext, useEffect, useState } from "react";
import { css } from "@emotion/react";

import { Comment } from "../../types/comment";
import { CommentListContext } from "../../providers/CommentListProvider";
import { CommentAPI } from "../../api/Comment";
import { BadButton, GoodButton } from "./ReactionButtons";

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
  const [goodIsClicked, setGoodIsClicked] = useState<boolean | undefined>(reply.liked);
  const [badIsClicked, setBadIsClicked] = useState<boolean | undefined>(reply.disliked);
  const [goodCount, setGoodCount] = useState<number | undefined>(reply.good_count);
  const [badCount, setBadCount] = useState<number | undefined>(reply.bad_count);

  const goodClickHandler = async () => {
    if (goodIsClicked) {
      await CommentAPI.unlike(reply.id);
      setGoodIsClicked(false);
      goodCount !== undefined && setGoodCount(goodCount - 1);
    } else {
      await CommentAPI.like(reply.id);
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
      await CommentAPI.undislike(reply.id);
      setBadIsClicked(false);
      badCount !== undefined && setBadCount(badCount - 1);
    } else {
      await CommentAPI.dislike(reply.id);
      setBadIsClicked(true);
      badCount !== undefined && setBadCount(badCount + 1);
    }
  };


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
          <GoodButton checked={goodIsClicked} count={goodCount} onClick={goodClickHandler} />
          <BadButton checked={badIsClicked} count={badCount} onClick={badClickHandler} />
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
