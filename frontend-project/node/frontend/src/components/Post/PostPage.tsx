/** @jsxImportSource @emotion/react */

import React, { FC } from "react";
import { css } from "@emotion/react";
import Card from "../common/Card";
import TagChoices from "./TagChoices";
import TagChip from "../common/TagChip";
import BackButton from "../common/BackButton";

export default function PostPage() {
  return (
    <div css={backgroundStyle}>
      <BackButton />
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
      <PostButton onClick={() => null}/>
    </div>
  );
}

interface ButtonProps {
  onClick: (event: React.MouseEvent) => void;
};

const PostButton: FC<ButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} css={postButtonStyle}>
      詠む
    </button>
  )
};

const backgroundStyle = css`
  background: linear-gradient(to bottom, #ffffff, #ff981f 50%);
  padding: 24px;
  height: calc(100vh - 48px);
  width: calc(100vw - 48px);
  overflow: scroll;
  & > div:nth-of-type(2) {
    margin-top: 60px;
  }
  & > div:last-of-type {
    margin-bottom: 48px;
  }
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

const postButtonStyle = css`
  outline: none;
  appearance: none;
  position: fixed;
  bottom: 48px;
  right: 24px;
  height: 60px;
  width: 128px;
  background-color: #ff981f;
  border: 1px solid #fff;
  border-radius: 30px;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.5);
  color: #fff;
`;
