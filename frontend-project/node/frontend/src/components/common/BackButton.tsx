/** @jsxImportSource @emotion/react */

import React from "react";
import BaseButton from "./BaseButton";

interface Props {
  onClick: (event: React.MouseEvent) =>  void;
}

export default function BackButton(props: Props) {
	const { onClick } = props;
	return (
		<BaseButton iconPath="" onClick={onClick} />
	);
}