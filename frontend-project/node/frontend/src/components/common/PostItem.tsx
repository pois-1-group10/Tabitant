/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react'
import { SerializedStyles, Theme, css } from '@emotion/react'
import { Post } from '../../types/post';
import PostContent from './PostContent';
import UserIcon from './UserIcon';
import { BadButton, CommentButton, GoodButton } from './ReactionButtons';
import { PostAPI } from '../../api/Post';
import { Link } from 'react-router-dom';

interface Props {
  post?: Post;
  link?: boolean;
  reaction?: boolean;
  style?: SerializedStyles;
}

export default function PostItem(props: Props) {
  const { post, link = true, reaction = true, style } = props;
  const [goodIsClicked, setGoodIsClicked] = useState<boolean | undefined>();
  const [badIsClicked, setBadIsClicked] = useState<boolean | undefined>();
  const [goodCount, setGoodCount] = useState<number | undefined>();
  const [badCount, setBadCount] = useState<number | undefined>();
  const userLink = { to: post?.user && link ? `/user_profile/${post.user.id}` : "" };
  const contentLink = { to: post && link ? `/post_detail/${post.id}` : "" };

  useEffect(() => {
    if (post?.liked !== undefined) setGoodIsClicked(post.liked);
    if (post?.disliked !== undefined) setBadIsClicked(post.disliked);
    if (post?.good_count !== undefined) setGoodCount(post.good_count);
    if (post?.bad_count !== undefined) setBadCount(post.bad_count);
  }, [post]);

  if (!post) {
    return (
      <div css={style}>
        <div css={contentStyle}>
          投稿がありません
        </div>
      </div>
    );
  }

  const goodClickHandler = async () => {
    if (!reaction) return;
    if (goodIsClicked) {
      await PostAPI.unlike(post.id);
      setGoodIsClicked(false);
      goodCount !== undefined && setGoodCount(goodCount - 1);
    } else {
      await PostAPI.like(post.id);
      setGoodIsClicked(true);
      goodCount !== undefined && setGoodCount(goodCount + 1);
    }
    if (badIsClicked) {
      setBadIsClicked(false);
      badCount !== undefined && setBadCount(badCount - 1);
    }
  };

  const badClickHandler = async () => {
    if (!reaction) return;
    if (goodIsClicked) {
      setGoodIsClicked(false);
      goodCount !== undefined && setGoodCount(goodCount - 1);
    }
    if (badIsClicked) {
      await PostAPI.undislike(post.id);
      setBadIsClicked(false);
      badCount !== undefined && setBadCount(badCount - 1);
    } else {
      await PostAPI.dislike(post.id);
      setBadIsClicked(true);
      badCount !== undefined && setBadCount(badCount + 1);
    }
  };

  return (
    <div css={style}>
      <Link css={[normalTextStyle, userStyle]} {...userLink} >
        <div css={userIconStyle}>
          <UserIcon user={post.user} />
        </div>
        <div>{post.user?.username ?? "Unknown"}</div>
      </Link>
      <Link css={[normalTextStyle, contentStyle]} {...contentLink}>
        <PostContent post={post} />
      </Link>
      <div css={reactionButtonWrapperStyle}>
        <GoodButton small={true} checked={goodIsClicked} count={goodCount ?? 0} onClick={goodClickHandler} />
        <BadButton small={true} checked={badIsClicked} count={badCount ?? 0} onClick={badClickHandler} />
        <CommentButton small={true} count={post.comment_count} />
      </div>
    </div>
  );
}

const normalTextStyle = css`
  text-decoration: none;
  color: black;
`;

const userStyle = css`
    display: flex;
    align-items: center;
    margin: 6px;
`;

const userIconStyle = css`
    display: inline-block;
    width: 28px;
    height: 28px;
    margin-right: 8px;
`;

const contentStyle = css`
    margin: 10px;
`;

const reactionButtonWrapperStyle = css`
  font-size: 10px;
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
