/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import BackButton from "../common/BackButton";
import TankaList from "../common/TankaList";
import SortButton from "../common/SortButton";

export default function FavoritesPage() {
  return (
    <div css={backgroundStyle}>
      <div css={buttonWrapperStyle}>
        <BackButton />
        <SortButton onClick={() => null}/>
      </div>
      <div css={sectionTitleStyle}>いいねした作品</div>
      <TankaList />
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

const buttonWrapperStyle = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const sectionTitleStyle = css`
	font-size: 24px;
	text-align: left;
`;
