/** @jsxImportSource @emotion/react */

import React, { ReactNode } from "react";
import { SerializedStyles, css } from "@emotion/react";

interface Props {
    style?: SerializedStyles;
    children?: ReactNode;
}

export default function Card(props: Props) {
    return (
        <div css={[backgroundStyle, props.style]}>
            {props.children}
        </div>
    )
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
