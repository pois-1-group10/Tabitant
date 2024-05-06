/** @jsxImportSource @emotion/react */

import React from "react";
import BaseButton from "./BaseButton";
import { useNavigate } from "react-router-dom";

interface Props {
  onClick?: (event: React.MouseEvent) =>  void;
}

export default function BackButton(props: Props) {
	const navigate = useNavigate();
	const { onClick = () => navigate(-1) } = props;

	return (
		<BaseButton iconPath="" onClick={onClick} />
	);
}