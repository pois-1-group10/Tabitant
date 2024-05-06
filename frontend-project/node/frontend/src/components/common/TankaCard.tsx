/** @jsxImportSource @emotion/react */

import React, { ReactElement, ReactNode } from "react";
import { SerializedStyles, css } from "@emotion/react";
import Card from "./Card";
import TagChip from "./TagChip";

interface Props {
  icon?: ReactElement;
	style?: SerializedStyles;
  children?: ReactNode;
}

export default function TankaCard(props: Props) {
  const { icon, style, children } = props;
	const concatenatedStyle = css`
		${cardStyle}
		${style}
	`;
  return (
    <Card style={concatenatedStyle}>
      <div css={postCardHeaderStyle}>
        {icon}
        <div css={postCardHeaderContentStyle}>
          <div css={tagsWrapperStyle}>
            <TagChip name="日常" />
            <TagChip name="自然" />
          </div>
          <div css={areaPositionWrapperStyle}>
            <div css={areaPositionTextStyle}>
              <div className="area">エリア</div>
              <div className="position">詳細位置</div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div css={mainTextWrapperStyle}>
        <p>あああああ</p>
        <p>あああああああ</p>
        <p>あああああ</p>
        <p>あああああああ</p>
        <p>あああああああ</p>
      </div>
			{children}
    </Card>
  );
}

const cardStyle = css`
  width: 100%;
`;

const postCardHeaderStyle = css`
  width: 100%;
  display: flex;
  gap: 4px;
`;

const tagsWrapperStyle = css`
  display: flex;
  gap: 8px;
  align-items: center;
  height: 32px;
`;

const postCardHeaderContentStyle = css`
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  gap: 8px;
`;

const mainTextWrapperStyle = css`
  writing-mode: vertical-rl;
  border: none;
  width: 100%;
  text-align: left;
  overflow: scroll;
  line-height: 40px;
  letter-spacing: 8px;
  font-size: 24px;
  p {
    margin: 0 20px;
    white-space: nowrap;
  }
`;

const areaPositionWrapperStyle = css`
  width: 100%;
`;

const areaPositionTextStyle = css`
  width: 80%;
  text-align: left;
  .area {
    font-size: 20px;
    font-weight: bold;
  }
  .position {
    font-size: 14px;
  }
`;