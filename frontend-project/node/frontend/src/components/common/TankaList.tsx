/** @jsxImportSource @emotion/react */

import React, { FC } from "react";
import { css } from "@emotion/react";

import thumbUpIcon from "../../img/thumb_up.svg";
import thumbDownIcon from "../../img/thumb_down.svg";
import Card from "./Card";
import { Link } from "react-router-dom";

export default function TankaList() {
  return (
		<Card style={cardStyle}>
			<TankaItem />
			<div css={lineStyle} />
			<TankaItem />
			<div css={lineStyle} />
		</Card>
	)
}

const TankaItem: FC = () => {
	return (
		<Link to="/post_detail/1/" css={tankaItemStyle}>
			<div css={tankaContentStyle}>雨の日の 下校のときに 見た枝は</div>
			<div css={tankaInfoStyle}>
				<div css={reactionWrapperStyle}>
					<div css={reactionBlockStyle}>
						<img src={thumbUpIcon} alt="" />
						<span>1000</span>
					</div>
					<div css={reactionBlockStyle}>
						<img src={thumbDownIcon} alt="" />
						<span>100</span>
					</div>
				</div>
				<span css={dateStyle}>2001-09-09</span>
 			</div>
		</Link>
	);
}

const cardStyle = css`
	display: flex;
	flex-flow: column;
	gap: 4px;
	width: 100%;
	background-color: rgba(255, 255, 255, 0.5);
`;

const lineStyle = css`
	width: 95%;
	margin: 0 auto;
	border-top: 1px solid #767878;
`;

const tankaItemStyle = css`
	display: block;
	text-decoration: none;
	color: initial;
	height: 40px;
	width: 95%;
	margin: 4px auto;
`;

const tankaContentStyle = css`
	font-size: 14px;
	margin-bottom: 4px;
`;

const tankaInfoStyle = css`
	display: flex;
	justify-content: space-between;
`;

const reactionWrapperStyle = css`
	display: flex;
	gap: 8px;
`;

const reactionBlockStyle = css`
	display: flex;
	align-items: center;
	img {
		height: 16px;
		width: 16px;
	}
	span {
		font-size: 12px;
	}
`;

const dateStyle = css`
	color: #767878;
	font-size: 12px;
`;
