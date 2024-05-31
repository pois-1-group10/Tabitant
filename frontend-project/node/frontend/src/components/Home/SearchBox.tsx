/** @jsxImportSource @emotion/react */

import { MouseEventHandler, useContext, useEffect, useState } from 'react'
import { Theme, css, keyframes } from '@emotion/react'
import { AnimatePresence, motion } from 'framer-motion';
import { PostListContext } from '../../providers/PostListProvider';
import { PostListParams } from '../../types/post';
import { emotions, tags } from '../../utils/constants';

type TipItemProps = {
    name: string,
    value: boolean,
    onClick: MouseEventHandler<HTMLButtonElement>
}

function TipItem(props: TipItemProps) {
    const { name, value, onClick } = props;
    return (
        <button type="button" css={value ? tagItemSelectedStyle : tagItemStyle} onClick={onClick}>
            {name}
        </button>
    );
}

export default function SearchBox() {
    const { posts, fetchPosts } = useContext(PostListContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const [text, setText] = useState("");
    const [tipSelected, setTipSelected] = useState<boolean[]>(Array(tags.length + emotions.length).fill(false));

    function clearAll() {
        setText("");
        setTipSelected(Array(tipSelected.length).fill(false));
    }

    function handleTipClick(index: number) {
        const next = tipSelected.slice();
        next[index] = !next[index];
        setTipSelected(next);
    }

    useEffect(() => {
        if (!isExpanded) {
            let params: PostListParams = {};
            if (text) params["search"] = text;
            params["tag"] = []
            params["emotion"] = []
            for (let i = 0; i < tags.length; i++) {
                if (tipSelected[i]) params["tag"].push(i + 1);
            }
            for (let i = 0; i < emotions.length; i++) {
                if (tipSelected[tags.length + i]) params["emotion"].push(i + 1);
            }
            fetchPosts(params);
        }
    }, [isExpanded]);

    return (
        <>
            <div css={[boxStyle, isExpanded && frontStyle]} onFocus={() => setIsExpanded(true)}>
                <input type='search' css={textAreaStyle} placeholder='検索' value={text}
                    onChange={(event) => setText(event.target.value)}
                />
                <motion.div css={filterViewStyle}
                    key="filterView"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                >
                    <hr />
                    <div>
                        <div css={filterViewHeaderStyle}>タグ</div>
                        {tags.map((t, i) => <TipItem key={i} name={t} value={tipSelected[i]} onClick={() => handleTipClick(i)} />)}
                    </div>
                    <div>
                        <div css={filterViewHeaderStyle}>感情</div>
                        {emotions.map((t, i) => <TipItem key={i} name={t} value={tipSelected[tags.length + i]} onClick={() => handleTipClick(tags.length + i)} />)}
                    </div>
                    <div css={clearFilterWrapperStyle}>
                        <button type="button" onClick={clearAll}>
                            検索条件をクリア
                        </button>
                    </div>
                </motion.div>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div css={overlayStyle}
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsExpanded(false)} />
                )}
            </AnimatePresence>
        </>
    );
}

const boxStyle = (theme: Theme) => css`
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 300px;
    min-width: 80%;
    max-width: calc(100% - 40px);
    margin: 20px auto;
    background: white;
    border: 1px solid ${theme.palette.secondary.light};
    border-radius: 20px;
    flex-flow: column;
    z-index: 12;
`

const textAreaStyle = css`
    width: 100%;
    height: 50px;
    line-height: 100%;
    font-size: 12pt;
    padding: 0 16px;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 20px;
    resize: none;

    &:focus {
        outline: none;
    }
`

const filterViewStyle = (theme: Theme) => css`
    overflow: hidden;

    hr {
        z-index: 13;
        margin: 0 10px;
        border: none;
        border-top: 1px solid ${theme.palette.secondary.light};
    }

    > div {
        margin: 10px;
        
        &::after {
            display: table;
            clear: both;
            content: '';
        }
    }
`

const filterViewHeaderStyle = (theme: Theme) => css`
    margin: 2px 4px;
    color: ${theme.palette.secondary.dark};
`

const tagItemStyle = (theme: Theme) => css`
    background: white;
    float: left;
    border: 1px solid ${theme.palette.secondary.main};
    color: ${theme.palette.secondary.main};
    font-size: 11pt;
    border-radius: 10px;
    margin: 4px 3px;
    padding: 2px 10px;
    cursor: pointer;
`

const tagItemSelectedStyle = (theme: Theme) => css`
    ${tagItemStyle(theme)}
    border: 1px solid ${theme.palette.primary.main};
    color: ${theme.palette.primary.main};
`

const clearFilterWrapperStyle = (theme: Theme) => css`
    text-align: right;

    button {
        background: #f2f2f2;
        border: 1px solid ${theme.palette.secondary.main};
        color: ${theme.palette.secondary.main};
        font-size: 11pt;
        border-radius: 10px;
        margin: 4px 3px;
        padding: 2px 10px;
        cursor: pointer;
    }

    button:hover {
        background: #d9d9d9;
    }
`

const overlayStyle = css`
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    width: 100dvw;
    height: 100vh;
    height: 100dvh;
    background: rgba(0, 0, 0, 0.5);
`

const frontStyle = css`
    z-index: 1000;
`
