/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import Card from "../common/Card";
import TankaCard from "../common/TankaCard";

export default function UserProfilePage() {
	return (
		<div css={backgroundStyle}>
			<div css={profileHeaderStyle}>
				<img src="" alt="" css={userIconStyle} />
				<div css={userInfoStyle}>
					<div className="user-name">ユーザー　ネーム</div>
					<div css={followDataStyle}>
						<div>
							<div className="number">1000</div>
							<div className="type">フォロー</div>
						</div>
						<div>
							<div className="number">100</div>
							<div className="type">フォロワー</div>
						</div>
						<div>
							<div className="number">1000</div>
							<div className="type">いいね</div>
						</div>
					</div>
				</div>
			</div>
			<p css={bioTextStyle}>よろしくお願いします。ああああああああああああああああああああ</p>
			<hr />
			<div css={sectionTitleStyle}>短歌</div>
			<TankaCard style={tankaCardStyle} />
			<div css={sectionTitleStyle}>受賞歴</div>
			<Card style={awardCardStyle}>
				
			</Card>
		</div>
	)
}

const backgroundStyle = css`
  background: linear-gradient(to bottom, #ffffff, #ff981f 50%);
  padding: 24px;
  height: calc(100vh - 48px);
  width: calc(100vw - 48px);
  overflow: scroll;
`;

const profileHeaderStyle = css`
	display: flex;
	align-items: center;
	gap: 24px;
	height: 112px;
`;

const userIconStyle = css`
	height: 96px;
	width: 96px;
	border: 1px solid #767878;
	border-radius: 48px;
	flex-shrink: 0;
`;

const userInfoStyle = css`
	display: flex;
	flex-flow: column;
	justify-content: end;
	gap: 8px;
	flex-grow: 1;
	height: 100%;
	max-width: calc(100% - 120px);
	.user-name {
		text-align: left;
		font-size: 20px;
		font-weight: bold;
		overflow: hidden;
		white-space: nowrap;
	}
`;

const followDataStyle = css`
	display: flex;
	justify-content: space-between;
	.number {
		font-weight: bold;
	}
	.type {
		font-size: 12px;
		color: #767878;
	}
`;

const bioTextStyle = css`
	font-size: 14px;
	margin: 16px 8px 8px;
	text-align: left;
`;

const sectionTitleStyle = css`
	font-size: 24px;
	text-align: left;
`;

const tankaCardStyle = css`
	background-color: rgba(255, 255, 255, 0.5);
`;

const awardCardStyle = css`
	background-color: rgba(255, 255, 255, 0.5);
	width: 100%;
	min-height: 120px;
`;
