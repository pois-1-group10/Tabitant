/** @jsxImportSource @emotion/react */

import React, { useContext, useEffect, useState } from "react";
import { css } from "@emotion/react";
import BackButton from "../common/BackButton";
import Card from "../common/Card";

import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import TankaCard from "../common/TankaCard";
import { PostDetailContext } from "../../providers/PostDetailProvider";
import { CommentListContext } from "../../providers/CommentListProvider";
import { useParams } from "react-router-dom";
import { BadButton, FollowButton, GoodButton } from "./ReactionButtons";
import { PostAPI } from "../../api/Post";
import { UserAPI } from "../../api/User";

export default function PostDetailPage() {
  const { post, fetchPostDetail } = useContext(PostDetailContext);
  const { comments, fetchComments } = useContext(CommentListContext);
  const [goodIsClicked, setGoodIsClicked] = useState<boolean|undefined>();
  const [badIsClicked, setBadIsClicked] = useState<boolean|undefined>();
  const [goodCount, setGoodCount] = useState<number | undefined>();
  const [badCount, setBadCount] = useState<number | undefined>();
	const [following, setFollowing] = useState<boolean | undefined>();
  const params = useParams();
  const postId = Number(params.id);

  useEffect(() => {
    fetchPostDetail();
    postId && fetchComments({ post_id: postId });
  }, []);

  useEffect(() => {
		if(post?.liked !== undefined) setGoodIsClicked(post.liked);
		if(post?.disliked !== undefined) setBadIsClicked(post.disliked);
		if(post?.good_count !== undefined) setGoodCount(post.good_count);
    if(post?.bad_count !== undefined) setBadCount(post.bad_count);
		if(post?.user?.following !== undefined) setFollowing(post.user.following);
  }, [post]);

  const goodClickHandler = async () => {
		if (goodIsClicked) {
			await PostAPI.unlike(postId);
			setGoodIsClicked(false);
			goodCount !== undefined && setGoodCount(goodCount - 1);
		} else {
			await PostAPI.like(postId);
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
			await PostAPI.undislike(postId);
			setBadIsClicked(false);
			badCount !== undefined && setBadCount(badCount - 1);
		} else {
			await PostAPI.dislike(postId);
			setBadIsClicked(true);
			badCount !== undefined && setBadCount(badCount + 1);
		}
	};

	const followClickHandler = async () => {
		if (following) {
			post && await UserAPI.unfollow(post?.user.id);
			setFollowing(false);
		} else {
			post && await UserAPI.follow(post?.user.id);
			setFollowing(true);
		}
	}

  return (
    <div css={backgroundStyle}>
      <BackButton />
      <TankaCard
        post={post}
        icon={<img src="" alt="" css={iconStyle} />}
        style={cardStyle}
      >
        <div css={reactionButtonWrapperStyle}>
          <GoodButton checked={goodIsClicked} count={goodCount ?? 0} onClick={goodClickHandler} />
          <BadButton checked={badIsClicked} count={badCount ?? 0} onClick={badClickHandler} />
          <FollowButton following={following} onClick={followClickHandler} />
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
