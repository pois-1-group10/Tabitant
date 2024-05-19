/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react'
import { Theme, css } from '@emotion/react'
import WhatshotIcon from '@mui/icons-material/Whatshot';
import TankaContent from '../common/PostContent';
import UserIcon from '../common/UserIcon';
import { PostDetailContext } from '../../providers/PostDetailProvider';
import PostItem from '../common/PostItem';

export default function FeaturedPost() {
    const { post, fetchHotPost } = useContext(PostDetailContext);
    const [shown, setShown] = useState(true);

    useEffect(() => {
        fetchHotPost()
    }, []);

    return shown && post ? (
        <>
            <div css={boxStyle}>
                <div css={headerStyle}>
                    <div css={hotIconStyle}>
                        <WhatshotIcon fontSize='small' />
                    </div>
                    <div>この近くのホットな短歌</div>
                    <button type="button" css={hideButtonStyle} onClick={() => setShown(false)}>非表示にする</button>
                </div>
                <PostItem post={post} />
            </div>
        </>
    ) : <></>;
}

const boxStyle = (theme: Theme) => css`
    display: flex;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    width: 300px;
    min-width: 80%;
    max-width: calc(100% - 40px);
    margin: 20px auto;
    padding: 10px;
    background: white;
    border: 1px solid ${theme.palette.secondary.light};
    border-radius: 20px;
    box-sizing: border-box;
    flex-flow: column;
    z-index: 2;
`

const headerStyle = (theme: Theme) => css`
    display: flex;
    align-items: center;
    font-size: 10pt;
    color: ${theme.palette.secondary.dark};
`

const hotIconStyle = (theme: Theme) => css`
    width: 20px;
    height: 20px;
    transform: translateY(-2px);
    margin-right: 2px;
    color: ${theme.palette.primary.main};
`

const hideButtonStyle = (theme: Theme) => css`
    font-size: 10pt;
    color: ${theme.palette.secondary.dark};
    border: none;
    background: transparent;
    display: inline-block;
    padding: 0;
    margin-left: auto;
    cursor: pointer;
`
