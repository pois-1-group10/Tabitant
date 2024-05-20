/** @jsxImportSource @emotion/react */

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { InfoWindowF } from '@react-google-maps/api';
import { css } from '@emotion/react'
import { Post } from '../../types/post';
import { postContentArray } from '../../utils/tanka';
import { Link } from 'react-router-dom';
import { BadButton, CommentButton, GoodButton } from '../common/ReactionButtons';
import { PostAPI } from '../../api/Post';
import { AuthUserContext } from '../../providers/AuthUserProvider';
import UserIcon from '../common/UserIcon';

type Props = {
  post: Post;
  link?: boolean;
  onCloseClick?: () => void;
};

export default function InfoWindow(props: Props) {
  const { post, link = true, onCloseClick } = props;
  const [goodIsClicked, setGoodIsClicked] = useState<boolean | undefined>();
  const [badIsClicked, setBadIsClicked] = useState<boolean | undefined>();
  const [goodCount, setGoodCount] = useState<number | undefined>();
  const [badCount, setBadCount] = useState<number | undefined>();
  const { currentUser } = useContext(AuthUserContext);
  const reaction = Boolean(currentUser);
  const userLink = post?.user && link ? `/user_profile/${post.user.id}` : "";
  const contentLink = post && link ? `/post_detail/${post.id}` : "";

  useEffect(() => {
    if (post?.liked !== undefined) setGoodIsClicked(post.liked);
    if (post?.disliked !== undefined) setBadIsClicked(post.disliked);
    if (post?.good_count !== undefined) setGoodCount(post.good_count);
    if (post?.bad_count !== undefined) setBadCount(post.bad_count);
  }, [post]);

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

  if (post.latitude === undefined || post.longitude === undefined) {
    return <></>;
  }

  return (
    <InfoWindowF position={new google.maps.LatLng(post.latitude, post.longitude)} onCloseClick={onCloseClick}>
      <>
        <Link css={[normalTextStyle, userStyle]} to={userLink}>
          <div css={userIconStyle}>
            <UserIcon user={post.user} />
          </div>
          <div>{post.user?.username ?? "Unknown"}</div>
        </Link>
        <Link css={[normalTextStyle, contentStyle]} to={contentLink}>
          <div>{postContentArray(post).slice(0, 3).join(" ")}</div>
          <div>{postContentArray(post).slice(3).join(" ")}</div>
        </Link>
        <div css={reactionButtonWrapperStyle}>
          <GoodButton small={true} checked={goodIsClicked} count={goodCount ?? 0} onClick={goodClickHandler} />
          <BadButton small={true} checked={badIsClicked} count={badCount ?? 0} onClick={badClickHandler} />
          <CommentButton small={true} count={post.comment_count} />
        </div>
      </>
    </InfoWindowF>
  );
}

const normalTextStyle = css`
  text-decoration: none;
  color: black;
`;

const userStyle = css`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const userIconStyle = css`
    display: inline-block;
    width: 28px;
    height: 28px;
    margin-right: 8px;
`;

const contentStyle = css`
  text-align: center;

  div {
    margin-bottom: 5px;
  }
`;

const reactionButtonWrapperStyle = css`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
`;
