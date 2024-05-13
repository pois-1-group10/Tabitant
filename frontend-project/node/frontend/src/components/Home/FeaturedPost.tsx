/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import { Theme, css } from '@emotion/react'
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { Post, User, Tanka, LatLng } from '../../models';
import TankaContent from '../common/TankaContent';
import UserIcon from '../common/UserIcon';
import { getDummyUsers } from '../../util';

const users = getDummyUsers(1);

async function getPost(): Promise<Post> {
    return new Post("1", users[0], new Tanka(["雨の日の", "下校のときに", "見た枝は", "くもの巣さえも", "美しきかな"]),
        new LatLng(35.026244, 135.780822));
}

export default function FeaturedPost() {
    const [shown, setShown] = useState(true);
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        getPost().then(res => setPost(res));
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
                <div css={userStyle}>
                    <div css={userIconStyle}>
                        <UserIcon user={post.user} />
                    </div>
                    <div>{post.user?.username ?? "Unknown"}</div>
                </div>
                <div css={contentStyle}>
                    <TankaContent tanka={post.content} />
                </div>
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

const userStyle = css`
    display: flex;
    align-items: center;
    margin: 6px;
`

const userIconStyle = css`
    display: inline-block;
    width: 28px;
    height: 28px;
    margin-right: 8px;
`

const contentStyle = css`
    margin: 10px;
`