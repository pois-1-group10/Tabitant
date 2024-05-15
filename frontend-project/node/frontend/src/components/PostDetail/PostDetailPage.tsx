/** @jsxImportSource @emotion/react */

import React, { FC, useContext, useEffect } from "react";
import { css } from "@emotion/react";
import BackButton from "../common/BackButton";
import Card from "../common/Card";

import thumbUpIcon from "../../img/thumb_up.svg";
import thumbDownIcon from "../../img/thumb_down.svg";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import TankaCard from "../common/TankaCard";
import { PostDetailContext } from "../../providers/PostDetailProvider";
import { CommentListContext } from "../../providers/CommentListProvider";
import { useParams } from "react-router-dom";

export default function PostDetailPage() {
  const { post, fetchPostDetail } = useContext(PostDetailContext);
  const { comments, fetchComments } = useContext(CommentListContext);
  const params = useParams();
  const postId = Number(params.id);

  useEffect(() => {
    fetchPostDetail();
    postId && fetchComments({ post_id: postId });
  }, []);

  return (
    <div css={backgroundStyle}>
      <BackButton />
      <TankaCard
        post={post}
        icon={<img src="" alt="" css={iconStyle} />}
        style={cardStyle}
      >
        <div css={reactionButtonWrapperStyle}>
          <div>
            <img src={thumbUpIcon} alt="" />
            <div css={thumbCountStyle}>{post?.good_count}</div>
          </div>
          <div>
            <img src={thumbDownIcon} alt="" />
            <div css={thumbCountStyle}>{post?.bad_count}</div>
          </div>
          <FollowButton onClick={() => null} />
        </div>
        <div css={commentInputWrapperStyle}>
          <img src="" alt="icon" css={selfIconStyle} />
          {post && <CommentInput postId={post.id} />}
        </div>
      </TankaCard>
      <Card style={cardStyle}>
        <div css={commentTitleStyle}>コメント</div>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </Card>
    </div>
  );
}

interface ButtonProps {
  onClick: (event: React.MouseEvent) => void;
}

const FollowButton: FC<ButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} css={followButtonStyle}>
      投稿者をフォロー
    </button>
  );
};

const backgroundStyle = css`
  background: linear-gradient(to bottom, #ffffff, #ff981f 50%);
  padding: 24px;
  height: calc(100vh - 48px);
  width: calc(100vw - 48px);
  overflow: scroll;
`;

const cardStyle = css`
  width: 100%;
  margin-top: 24px;
  &:first-of-type {
    margin-top: 60px;
  }
`;

const iconStyle = css`
  height: 40px;
  width: 40px;
  border-radius: 20px;
  border: 1px solid #303030;
`;

const selfIconStyle = css`
  height: 32px;
  width: 32px;
  border-radius: 16px;
  border: 1px solid #303030;
`;

const reactionButtonWrapperStyle = css`
  margin-top: 40px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 32px;
  text-align: center;
  img {
    height: 24px;
    width: 24px;
  }
`;

const thumbCountStyle = css`
  font-size: 12px;
`;

const commentInputWrapperStyle = css`
  margin-top: 16px;
  display: flex;
  align-items: start;
  gap: 8px;
`;

const commentTitleStyle = css`
  font-size: 24px;
  text-align: left;
  padding: 0 4px;
  color: #767878;
`;

const followButtonStyle = css`
  outline: none;
  appearance: none;
  height: 32px;
  width: 128px;
  background-color: #ff981f;
  border: 1px solid #303030;
  border-radius: 16px;
  font-size: 14px;
  color: #fff;
`;
