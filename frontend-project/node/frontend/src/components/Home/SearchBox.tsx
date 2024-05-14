/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import { Theme, css } from '@emotion/react'
import { AnimatePresence, motion } from 'framer-motion';
import { Tag } from '../../models';

async function getTags(): Promise<Tag[]> {
    return [
        new Tag("1", "日常"),
        new Tag("2", "人間関係"),
        new Tag("3", "仕事"),
        new Tag("4", "人生"),
        new Tag("5", "家族"),
        new Tag("6", "恋愛"),
        new Tag("7", "旅行"),
        new Tag("8", "自然"),
        new Tag("9", "時事"),
        new Tag("11", "emo:穏やか"),
        new Tag("12", "emo:嬉しい"),
        new Tag("13", "emo:面白い"),
        new Tag("14", "emo:しみじみ"),
        new Tag("15", "emo:寂しい"),
        new Tag("16", "emo:怒り"),
    ];
}

function TagItem({ tag }: { tag: Tag }) {
    const [selected, setSelected] = useState(false);

    return (
        <button type="button" css={selected ? tagItemSelectedStyle : tagItemStyle} onClick={() => setSelected(!selected)}>
            {tag.getDisplayName()}
        </button>
    );
}

export default function SearchBox() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [tags, setTags] = useState<Tag[] | null>(null);

    useEffect(() => {
        getTags().then(res => setTags(res));
    }, []);

    return (
        <>
            <div css={[boxStyle, isExpanded && frontStyle]} onFocus={() => setIsExpanded(true)}>
                <input type='text' css={textAreaStyle} placeholder='検索' />
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div css={filterViewStyle}
                            key="filterView"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}>
                            <hr />
                            <div>
                                <div css={filterViewHeaderStyle}>タグ</div>
                                {tags && tags.filter(t => !t.isEmotion()).map(t => <TagItem key={t.id} tag={t} />)}
                            </div>
                            <div>
                                <div css={filterViewHeaderStyle}>感情</div>
                                {tags && tags.filter(t => t.isEmotion()).map(t => <TagItem key={t.id} tag={t} />)}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
