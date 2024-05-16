/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";

interface Props {
  name: string;
}

export default function TagChip(props: Props) {
  const { name }  = props;
  return (
    <div css={outerframeStyle}>
      <div css={innerCircleStyle} />
      <div>{name}</div>
    </div>
  );
}

const outerframeStyle = css`
  display: flex;
  height: 24px;
  padding: 4px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 2px solid #ff981f;
  background-color: #fff;
  font-size: 12px;
  font-weight: bold;
  line-height: 12px;
  gap: 2px;
  color: #ff981f;
`;

const innerCircleStyle = css`
  width: 8px;
  height: 8px;
  border: 2px solid #ff981f;
  border-radius: 6px;
`;
