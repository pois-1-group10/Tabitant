/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";

interface Props {
  name: string;
  selected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export default function TagChip(props: Props) {
  const { name, selected = true, onClick } = props;
  const tagColor = selected ? "#ff981f" : "#767878";

  const outerframeStyle = css`
    display: flex;
    height: 24px;
    padding: 4px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 2px solid ${tagColor};
    background-color: #fff;
    font-size: 12px;
    font-weight: bold;
    line-height: 12px;
    gap: 2px;
    color: ${tagColor};
  `;

  const innerCircleStyle = css`
    width: 8px;
    height: 8px;
    border: 2px solid ${tagColor};
    border-radius: 6px;
  `;

  return (
    <div css={outerframeStyle} onClick={onClick}>
      <div css={innerCircleStyle} />
      <div>{name}</div>
    </div>
  );
}
