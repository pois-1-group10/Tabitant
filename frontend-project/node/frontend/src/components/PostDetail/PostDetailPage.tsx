/** @jsxImportSource @emotion/react */

import React, { FC } from "react";
import { css } from "@emotion/react";
import { useParams } from "react-router-dom";
import BackButton from "../common/BackButton";
import Card from "../common/Card";

import thumbUpIcon from "../../img/thumb_up.svg";
import thumbDownIcon from "../../img/thumb_down.svg";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import TankaCard from "../common/TankaCard";

export default function PostDetailPage() {
	const params = useParams();
	const id = params.id;
	return (
		<div css={backgroundStyle}>
			<BackButton />
			<TankaCard 
				icon={<img src="" alt="" css={iconStyle} />}
				style={cardStyle}
			>
				<div css={reactionButtonWrapperStyle}>
					<div>
						<img src={thumbUpIcon} alt="" />
						<div css={thumbCountStyle}>0</div>
					</div>
					<div>
						<img src={thumbDownIcon} alt="" />
						<div css={thumbCountStyle}>0</div>
					</div>
					<FollowButton onClick={() => null}/>
				</div>
				<div css={commentInputWrapperStyle}>
					<img src="" alt="icon" css={selfIconStyle} />
					<CommentInput />
				</div>
      </TankaCard>
			<Card style={cardStyle}>
				<div css={commentTitleStyle}>コメント</div>
				<CommentItem />
				<CommentItem />
				<CommentItem />
			</Card>
		</div>
	)
}

interface ButtonProps {
  onClick: (event: React.MouseEvent) => void;
};

const FollowButton: FC<ButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} css={followButtonStyle}>
      投稿者をフォロー
    </button>
  )
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

