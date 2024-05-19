/** @jsxImportSource @emotion/react */

import React, { FC } from "react";
import { Theme, css } from "@emotion/react";

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface FollowButtonProps {
  following?: boolean;
  onClick: (event: React.MouseEvent) => void;
}

interface GoodBadButtonProps {
  checked?: boolean;
  count?: number;
  small?: boolean;
  onClick: (event: React.MouseEvent) => void;
}

interface CommentButtonProps {
  count?: number;
  small?: boolean;
}

export const FollowButton: FC<FollowButtonProps> = ({ following, onClick }) => {
  return (
    <button onClick={onClick} css={followButtonStyle}>
      {following ? "フォローを解除" : "投稿者をフォロー"}
    </button>
  );
};

export const GoodButton: FC<GoodBadButtonProps> = (props) => {
  const { checked, count, small = false, onClick } = props;
  const containerStyle = small ? smallContainerStyle : largeContainerStyle;
  const iconStyle = small ? smallIconStyle : largeIconStyle;
  const countStyle = small ? smallCountStyle : largeCountStyle;

  return checked !== undefined ? (
    <div css={containerStyle} onClick={onClick}>
      {checked ? <ThumbUpAltIcon css={iconStyle} /> : <ThumbUpOffAltIcon css={iconStyle} />}
      <div css={countStyle}>{count}</div>
    </div>
  ) : (
    <div></div>
  );
};

export const BadButton: FC<GoodBadButtonProps> = (props) => {
  const { checked, count, small = false, onClick } = props;
  const containerStyle = small ? smallContainerStyle : largeContainerStyle;
  const iconStyle = small ? smallIconStyle : largeIconStyle;
  const countStyle = small ? smallCountStyle : largeCountStyle;

  return checked !== undefined ? (
    <div css={containerStyle} onClick={onClick}>
      {checked ? <ThumbDownAltIcon css={iconStyle} /> : <ThumbDownOffAltIcon css={iconStyle} />}
      <div css={countStyle}>{count}</div>
    </div>
  ) : (
    <div></div>
  );
};

export const CommentButton: FC<CommentButtonProps> = (props) => {
  const { count, small = false } = props;
  const containerStyle = small ? smallContainerStyle : largeContainerStyle;
  const iconStyle = small ? smallIconStyle : largeIconStyle;
  const countStyle = small ? smallCountStyle : largeCountStyle;

  return (
    <div css={containerStyle}>
      <ChatBubbleOutlineIcon css={iconStyle} />
      <div css={countStyle}>{count}</div>
    </div>
  );
};

const largeContainerStyle = css`
`;

const smallContainerStyle = (theme: Theme) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.palette.secondary.main};
`;

const largeIconStyle = css`
`;

const smallIconStyle = css`
  font-size: 20px;
`;

const largeCountStyle = css`
  font-size: 12px;
`;

const smallCountStyle = css`
  font-size: 12px;
  margin-left: 6px;
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
