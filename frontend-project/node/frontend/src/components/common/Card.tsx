/** @jsxImportSource @emotion/react */

import React, { ReactNode } from "react";
import { SerializedStyles, css } from "@emotion/react";
import { Link } from "react-router-dom";

interface Props {
  to?: string;
  style?: SerializedStyles;
  children?: ReactNode;
}

export default function Card(props: Props) {
  const { to, style, children } = props;
  return to ? (
    <Link to={to} css={[backgroundStyle, anchorCancelStyle, style]}>
      {children}
    </Link>
  ) : (
    <div css={[backgroundStyle, style]}>{children}</div>
  );
}

const backgroundStyle = css`
  background-color: #fff;
  border: 1px solid #767878;
  box-sizing: border-box;
  border-radius: 20px;
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.4);
  padding: 8px;
  width: fit-content;
`;

const anchorCancelStyle = css`
	display: block;
	text-decoration: none;
	color: initial;
`;
