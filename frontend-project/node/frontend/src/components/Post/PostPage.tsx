/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import Card from "../common/Card";
import TagChoices from "./TagChoices";
import TagChip from "../common/TagChip";
import BackButton from "../common/BackButton";

export default function PostPage() {
  return (
    <div css={backgroundStyle}>
      <BackButton onClick={() => null}/>
      <Card style={postCardStyle}>
        <div css={postCardHeaderStyle}>
          <img src="" alt="icon" css={iconStyle} />
          <div css={postCardHeaderContentStyle}>
            <TagChoices>
              <TagChip name="日常" />
              <TagChip name="自然" />
            </TagChoices>
            <div css={areaPositionWrapperStyle}>
              <div css={areaPositionTextStyle}>
                <div className="area">エリア</div>
                <div className="position">詳細位置</div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <textarea css={mainTextareaStyle} />
      </Card>
      <Card style={postCardStyle}>
        <p css={hiraganaTitleStyle}>ひらがな入力</p>
        <hr />
        <textarea css={mainTextareaStyle} />
      </Card>
    </div>
  );
}

const backgroundStyle = css`
  background: linear-gradient(to bottom, #ffffff, #ff981f 50%);
  padding: 24px;
  height: calc(100vh - 48px);
  width: calc(100vw - 48px);
  overflow: scroll;
`;

const postCardStyle = css`
  width: 100%;
  margin-top: 24px;
`;

const postCardHeaderStyle = css`
  width: 100%;
  display: flex;
  gap: 4px;
`;

const iconStyle = css`
  height: 32px;
  width: 32px;
  border-radius: 16px;
  border: 1px solid #303030;
`;

const postCardHeaderContentStyle = css`
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  gap: 8px;
`;

const mainTextareaStyle = css`
  writing-mode: vertical-rl;
  border: none;
  width: 100%;
  line-height: 60px;
  letter-spacing: 8px;
  font-size: 24px;
`;

const areaPositionWrapperStyle = css`
  width: 100%;
`;

const areaPositionTextStyle = css`
  width: 80%;
  text-align: left;
  .area {
    font-size: 24px;
    font-weight: bold;
  }
  .position {
    font-size: 14px;
  }
`;

const hiraganaTitleStyle = css`
  color: #999;
  font-size: 24px;
  margin: 0;
`;
