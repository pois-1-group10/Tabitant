/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import BackButton from "../common/BackButton";
import TankaList from "../common/TankaList";
import SortButton from "../common/SortButton";

export default function UserTankaPage() {
  return (
    <div css={backgroundStyle}>
      <BackButton />
      <SortButton style={sortButtonStyle} onClick={() => null}/>
      <div css={sectionTitleStyle}>短歌一覧</div>
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

const sectionTitleStyle = css`
  margin-top: 60px;
	font-size: 24px;
	text-align: left;
`;

const sortButtonStyle = css`
  left: initial;
  right: 20px;
`;
