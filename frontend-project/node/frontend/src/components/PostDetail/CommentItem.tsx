/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";

import thumbUpIcon from "../../img/thumb_up.svg";
import thumbDownIcon from "../../img/thumb_down.svg";

export default function CommentItem() {
	return (
		<div css={wrapperStyle}>
			<img src="" alt="" css={iconStyle}/>
			<div css={contentWrapperStyle}>
				<div css={commenterNameStyle}>まさおかしき</div>
				<p>あああ</p>
				<div css={commentFooterStyle}>
					<div>
						<img src={thumbUpIcon} alt="" />
						<div css={thumbCountStyle}>0</div>
					</div>
					<div>
						<img src={thumbDownIcon} alt="" />
						<div css={thumbCountStyle}>0</div>
					</div>
					<div css={replyOpenerStyle}>100件の返信</div>
				</div>
			</div>
		</div>
	)
}

const wrapperStyle = css`
	display: flex;
	gap: 8px;
`;

const iconStyle = css`
	width: 32px;
	height: 32px;
	border-radius: 20px;
	border: 1px solid #303030;
`;

const contentWrapperStyle = css`
	flex-grow: 1;
	text-align: left;
	p {
		margin: 4px 0;
	}
`;

const commenterNameStyle = css`
	color: #767878;
	font-size: 12px;
`;

const commentFooterStyle = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 60%;
	text-align: center;
`;

const thumbCountStyle = css`
	font-size: 12px;
`;

const replyOpenerStyle = css`
	color: #ff981f;
	font-size: 14px;
`;
