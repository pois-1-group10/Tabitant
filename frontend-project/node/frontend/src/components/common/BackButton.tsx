/** @jsxImportSource @emotion/react */

import React from "react";
import { useNavigate } from "react-router-dom";
import { SerializedStyles } from "@emotion/react";

import BaseButton from "./BaseButton";

import backArrowIcon from "../../img/back-arrow.svg";

interface Props {
  style?: SerializedStyles;
  onClick?: (event: React.MouseEvent) => void;
}

export default function BackButton(props: Props) {
  const navigate = useNavigate();
  const { style, onClick = () => navigate(-1) } = props;

  return (
    <BaseButton iconPath={backArrowIcon} style={style} onClick={onClick} />
  );
}
