/** @jsxImportSource @emotion/react */

import React, { FC } from "react";
import { css } from "@emotion/react";

import thumbUpIcon from "../../img/thumb_up.svg";
import thumbDownIcon from "../../img/thumb_down.svg";

interface FollowButtonProps {
  following?: boolean;
  onClick: (event: React.MouseEvent) => void;
}

interface GoodBadButtonProps {
  checked?: boolean;
  count?: number;
  onClick: (event: React.MouseEvent) => void;
}

export const FollowButton: FC<FollowButtonProps> = ({ following, onClick }) => {
  return (
    <button onClick={onClick} css={followButtonStyle}>
      {following ? "フォローを解除" : "投稿者をフォロー"}
    </button>
  );
};

export const GoodButton: FC<GoodBadButtonProps> = (props) => {
  const { checked, count, onClick } = props;

  return checked !== undefined ? (
    <div onClick={onClick}>
      {checked ? (
        <img src={thumbUpIcon} alt="" />
      ) : (
        <img src={thumbUpIcon} alt="" />
      )}
      <div css={thumbCountStyle}>{count}</div>
    </div>
  ) : (
    <div></div>
  );
};

export const BadButton: FC<GoodBadButtonProps> = (props) => {
  const { checked, count, onClick } = props;

  return checked !== undefined ? (
    <div onClick={onClick}>
      {checked ? (
        <img src={thumbDownIcon} alt="" />
      ) : (
        <img src={thumbDownIcon} alt="" />
      )}
      <div css={thumbCountStyle}>{count}</div>
    </div>
  ) : (
    <div></div>
  );
};

const thumbCountStyle = css`
  font-size: 12px;
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
