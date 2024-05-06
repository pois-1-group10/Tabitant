/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";

interface Props {
	iconPath: string;
	onClick: (event: React.MouseEvent) =>  void;
}

export default function BaseButton(props: Props) {
	const { iconPath, onClick } = props;
	return (
		<div css={buttonStyle} onClick={onClick}>
			<img src={iconPath} alt="" />
		</div>
	);
}

const buttonStyle = css`
	width: 48px;
	height: 48px;
	border-radius: 24px;
	background-color: #ff981f;
	box-shadow: 1px 3px 4px 0 rgba(0, 0, 0, 0.4);
`;
