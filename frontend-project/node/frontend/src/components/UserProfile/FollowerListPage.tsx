/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import BackButton from "../common/BackButton";
import SortButton from "../common/SortButton";
import UserList from "../common/UserList";

export default function FollowerListPage() {
	return (
		<div css={backgroundStyle}>
			<BackButton />
			<SortButton style={sortButtonStyle} onClick={() => null}/>
			<div css={pageTitleStyle}>フォロワー</div>
			<div css={userListWrapperStyle}>
      	<UserList />
			</div>
		</div>
	)
}

const backgroundStyle = css`
	display: flex;
  flex-flow: column;
  gap: 16px;
  background: linear-gradient(to bottom, #ffffff, #ff981f 50%);
  padding: 24px;
  height: calc(100vh - 48px);
  width: calc(100vw - 48px);
  overflow: scroll;
`;

const pageTitleStyle = css`
	margin-top: 40px;
	text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

const userListWrapperStyle = css`
	flex-grow: 1;
	overflow: scroll;
`;

const sortButtonStyle = css`
  left: initial;
  right: 20px;
`;

