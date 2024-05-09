/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import BackButton from "../common/BackButton";
import SortButton from "../common/SortButton";
import UserList from "../common/UserList";

export default function FollowUserListPage() {
  return (
    <div css={backgroundStyle}>
      <div css={buttonsWrapperStyle}>
        <BackButton />
        <div css={pageTitleStyle}>フォロー中</div>
        <SortButton onClick={() => null} />
      </div>
			<div css={userListWrapperStyle}>
      	<UserList />
			</div>
    </div>
  );
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
  font-size: 18px;
  font-weight: bold;
`;

const buttonsWrapperStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const userListWrapperStyle = css`
	flex-grow: 1;
	overflow: scroll;
`;
