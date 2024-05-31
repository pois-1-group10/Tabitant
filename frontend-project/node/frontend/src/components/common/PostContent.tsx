/** @jsxImportSource @emotion/react */

import React from 'react'
import { SerializedStyles, Theme, css } from '@emotion/react'
import { Post } from '../../types/post';
import { postContentArray } from '../../utils/tanka';

type Props = {
    post: Post;
    style?: SerializedStyles;
};

export default function PostContent(props: Props) {
    const { post, style } = props;
    return (
        <div css={[boxStyle, style]}>
            {postContentArray(post).map((s, i) => <div key={i} css={contentStyle}>{s}</div>)}
        </div>
    );
}

const boxStyle = (theme: Theme) => css`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: center;
`

const contentStyle = (theme: Theme) => css`
    // https://mimi.moe.in/nmp/fonts/fonts
    font-family: "Toppan Bunkyu Midashi Mincho", "凸版文久見出し明朝", "UD デジタル 教科書体 N-B", "UD Digi Kyokasho N-B";
    letter-spacing: 4px;
    writing-mode: vertical-rl;
    text-align: right;
    margin: 0 10px;
`
