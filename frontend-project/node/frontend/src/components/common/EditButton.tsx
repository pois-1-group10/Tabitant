/** @jsxImportSource @emotion/react */

import React from "react";
import { SerializedStyles } from "@emotion/react";

import BaseButton from "./BaseButton";
import sortIcon from "../../img/edit.svg";

interface Props {
  style?: SerializedStyles;
  onClick: (event: React.MouseEvent) => void;
}

export default function EditButton(props: Props) {
  const { style, onClick } = props;

  return <BaseButton iconPath={sortIcon} style={style} onClick={onClick} />;
}
