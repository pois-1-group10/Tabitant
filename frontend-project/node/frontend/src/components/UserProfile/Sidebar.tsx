/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import CancelButton from "../common/CancelButton";

interface Props {
  setSidebarIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar(props: Props) {
  const { setSidebarIsOpen } = props;

  return (
    <div css={shadowStyle}>
      <CancelButton
        style={cancelButtonStyle}
        onClick={() => setSidebarIsOpen(false)}
      />
      <div css={sidebarBackgroundStyle}>
        <div css={linkWrapperStyle}>
          <div css={linkButtonStyle}>プロフィール編集</div>
          <div css={breakLineStyle} />
          <div css={linkButtonStyle}>短歌一覧</div>
          <div css={breakLineStyle} />
          <div css={linkButtonStyle}>いいねした作品</div>
          <div css={breakLineStyle} />
          <div css={linkButtonStyle}>パスワード変更</div>
          <div css={breakLineStyle} />
          <div css={linkButtonStyle}>ログアウト</div>
          <div css={breakLineStyle} />
					<div css={linkButtonAlertStyle}>アカウント削除</div>
          <div css={breakLineStyle} />
        </div>
      </div>
    </div>
  );
}

const shadowStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  height: 100vh;
  width: 100vw;
  z-index: 10;
`;

const cancelButtonStyle = css`
  position: absolute;
  top: 20px;
  right: 20px;
`;

const sidebarBackgroundStyle = css`
  margin-left: 50vw;
  padding: 80px 0;
  height: 100vh;
  width: 50vw;
  background-color: #fff;
`;

const linkWrapperStyle = css`
  margin: auto;
  width: 90%;
  box-sizing: border-box;
`;

const linkButtonStyle = css`
  height: 40px;
  width: 168px;
  line-height: 40px;
  margin: 2px auto;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
`;

const linkButtonAlertStyle = css`
  height: 40px;
  width: 168px;
  line-height: 40px;
  margin: 2px auto;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
	color: red;
`;

const breakLineStyle = css`
  width: 100%;
  border-top: 1px solid black;
`;