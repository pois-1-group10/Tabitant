/** @jsxImportSource @emotion/react */

import React, { FC, useContext, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { User } from "../../types/user";
import { Emotion } from "../../types/emo";
import Card from "../common/Card";
import EmotionRadarChart from "../common/EmotionRadarChart";
import { SimilarUserContext } from "../../providers/SimilarUserProvider";
import { UserAPI } from "../../api/User";

export default function SimilarUserList() {
  const { users, loading, fetchSimilarUsers } = useContext(SimilarUserContext);

  useEffect(() => {
    fetchSimilarUsers();
  }, []);

  return (
    <div css={userListStyle}>
      {users.length > 0 ? (
        users.map((user) => <UserItem key={user.id} user={user} />)
      ) : (
        loading || <p>ユーザーが見つかりませんでした</p>
      )}
    </div>
  );
}

const UserItem: FC<{ user: User & Emotion }> = ({ user }) => {
	const [followed, setFollowed] = useState<boolean>(user.followed ?? false);
  const onClickFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await UserAPI.follow(user.id);
		setFollowed(true);
  };

  const onClickUnfollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await UserAPI.unfollow(user.id);
		setFollowed(false);
  };

  return (
    <Card style={userItemStyle} to={`/user_profile/${user.id}/`}>
      <div css={userHeaderStyle}>
        <img src={user.image} alt="" css={iconStyle} />
        <p>{user.username}</p>
      </div>
      <EmotionRadarChart
        ureshii={user.emotion_ureshii ?? 0}
        omoshiroi={user.emotion_omoshiroi ?? 0}
        samishii={user.emotion_samishii ?? 0}
        shimijimi={user.emotion_shimijimi ?? 0}
        odayaka={user.emotion_odayaka ?? 0}
        ikari={user.emotion_ikari ?? 0}
      />
      {user.followed !== undefined &&
        (followed ? (
          <UnfollowButton onClick={onClickUnfollow} />
        ) : (
          <FollowButton onClick={onClickFollow} />
        ))}
    </Card>
  );
};

interface InnerProps {
  onClick: (e: React.MouseEvent) => void;
}

const FollowButton: FC<InnerProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} css={followButtonStyle}>
      フォローする
    </button>
  );
};

const UnfollowButton: FC<InnerProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} css={unfollowButtonStyle}>
      フォロー解除
    </button>
  );
};

const userListStyle = css`
  display: flex;
  width: calc(100vw - 48px);
  padding: 8px 24px;
	transform: translateX(-24px);
  overflow: scroll;
  gap: 8px;
  p {
    width: 100%;
    text-align: left;
    font-size: 14px;
  }
`;

const userItemStyle = css`
  display: flex;
  flex-flow: column;
  gap: 8px;
  align-items: center;
  height: fit-content;
  width: 180px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.5);
`;

const userHeaderStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  color: initial;
  width: 100%;
  overflow: hidden;
  text-decoration: none;
  p {
    margin: 0;
    font-weight: bold;
    text-align: left;
    overflow: scroll;
  }
`;

const iconStyle = css`
  height: 40px;
  width: 40px;
  border-radius: 20px;
  border: 1px solid #303030;
  flex-shrink: 0;
`;

const followButtonStyle = css`
  outline: none;
  appearance: none;
  height: 32px;
  width: 100%;
  background-color: #ff981f;
  border: 1px solid #303030;
  border-radius: 16px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.5);
  font-size: 14px;
  color: #fff;
`;

const unfollowButtonStyle = css`
  outline: none;
  appearance: none;
  height: 32px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #303030;
  border-radius: 16px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.5);
  font-size: 14px;
  color: #ff981f;
`;
