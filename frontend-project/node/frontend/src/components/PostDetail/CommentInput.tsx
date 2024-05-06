/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";

export default function CommentInput() {
  return (
		<input type="text" placeholder="コメントをする" css={inputStyle}/>
	)
}

const inputStyle = css`
	flex-grow: 1;
	height: 32px;
	padding: 0 12px;
	background-color: #d9d9d9;
	border: none;
	border-radius: 16px;
	font-size: 16px;
	&:focus { 
		outline: none;
	}
`;
