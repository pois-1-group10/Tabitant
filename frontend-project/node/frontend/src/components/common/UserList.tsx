/** @jsxImportSource @emotion/react */

import React, { FC } from "react";
import { css } from "@emotion/react";
import { User } from "../../types/user";

type Props = {
  users: User[];
}

export default function UserList(props: Props) {
  const { users } = props;

  return (
    <div css={userListStyle}>
      {users.map(user => (
        <UserItem key={user.id} user={user} following />
      ))}
    </div>
  );
}

interface UserItemProps {
  user: User;
  following: boolean;
}

const UserItem: FC<UserItemProps> = (props: UserItemProps) => {
  const { user, following = true } = props;
  return (
    <div css={userItemWrapperStyle}>
      <img src="" alt="" />
      <div css={userNameStyle}>{user.username}</div>
      {following ? (
        <UnfollowButton onClick={() => null} />
      ) : (
        <FollowButton onClick={() => null} />
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
