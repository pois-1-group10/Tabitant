/** @jsxImportSource @emotion/react */

import React, { ReactNode } from "react";
import { css } from "@emotion/react";

interface Props {
  children?: ReactNode;
}

export default function TagChoices(props: Props) {
  return (
    <div css={wrapperStyle}>
      {props.children}
    </div>
  );
}

const wrapperStyle = css`
  display: flex;
  gap: 8px;
  height: 32px;
  align-items: center;
`;
