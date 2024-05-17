/** @jsxImportSource @emotion/react */

import React, { FC, useState } from "react";
import { css } from "@emotion/react";
import { User } from "../../types/user";
import { UserAPI } from "../../api/User";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUserContext } from "../../providers/AuthUserProvider";

type Props = {
  users: User[];
};

export default function UserList(props: Props) {
  const { users } = props;
  const { currentUser } = useContext(AuthUserContext);

  return (
    <div css={userListStyle}>
      {users.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          following={user.followed}
          myself={currentUser?.id === user.id}
        />
      ))}
    </div>
  );
}

interface UserItemProps {
  user: User;
  following?: boolean;
  myself: boolean;
}

const UserItem: FC<UserItemProps> = (props: UserItemProps) => {
  const { user, following = true, myself } = props;
  const [isFollowing, setIsFollowing] = useState<boolean>(following);
  const navigate = useNavigate();

  const navigateToUserDetail = () => {
    navigate(`/user_profile/${user.id}`);
  };

  const onClickFollowButton = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await UserAPI.follow(user.id);
    setIsFollowing(true);
  };

  const onClickUnFollowButton = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await UserAPI.unfollow(user.id);
    setIsFollowing(false);
  };

  return (
    <div css={userItemWrapperStyle} onClick={navigateToUserDetail}>
      <img src="" alt="" />
      <div css={userNameStyle}>{user.username}</div>
      {myself ? (
        <></>
      ) : isFollowing ? (
        <UnfollowButton onClick={onClickUnFollowButton} />
      ) : (
        <FollowButton onClick={onClickFollowButton} />
      )}
    </div>
  );
};

interface FollowButtonProps {
  onClick: (event: React.MouseEvent) => void;
}

const UnfollowButton: FC<FollowButtonProps> = ({
  onClick,
}: FollowButtonProps) => {
  return (
    <div css={unfollowButtonStyle} onClick={onClick}>
      フォロー解除
    </div>
  );
};

const FollowButton: FC<FollowButtonProps> = ({
  onClick,
}: FollowButtonProps) => {
  return (
    <div css={followButtonStyle} onClick={onClick}>
      フォローする
    </div>
  );
};

const userListStyle = css`
  display: flex;
  flex-flow: column;
  gap: 12px;
`;

const userItemWrapperStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  img {
    height: 36px;
    width: 36px;
    border: 1px solid #303030;
    border-radius: 20px;
  }
`;

const userNameStyle = css`
  flex-grow: 1;
  text-align: left;
  font-size: 18px;
`;

const unfollowButtonStyle = css`
  height: 20px;
  width: 80px;
  border-radius: 8px;
  background-color: transparent;
  border: 1px solid #303030;
  text-align: center;
  font-size: 12px;
`;

const followButtonStyle = css`
  height: 20px;
  width: 80px;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #303030;
  text-align: center;
  font-size: 12px;
`;
