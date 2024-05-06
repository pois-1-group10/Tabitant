/** @jsxImportSource @emotion/react */

import React from "react";
import { SerializedStyles, css } from "@emotion/react";

interface Props {
	iconPath: string;
	style?: SerializedStyles;
	onClick: (event: React.MouseEvent) =>  void;
}

export default function BaseButton(props: Props) {
	const { iconPath, style, onClick } = props;
	return (
		<div css={[style, buttonStyle]} onClick={onClick}>
			<img src={iconPath} alt="" css={iconStyle} />
		</div>
	);
}

const buttonStyle = css`
	position: relative;
	width: 48px;
	height: 48px;
	border-radius: 24px;
	background-color: #ff981f;
	box-shadow: 1px 3px 4px 0 rgba(0, 0, 0, 0.4);
`;

const iconStyle = css`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
`;
