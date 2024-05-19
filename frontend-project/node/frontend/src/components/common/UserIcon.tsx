/** @jsxImportSource @emotion/react */

import { Theme, css } from '@emotion/react'
import PersonIcon from '@mui/icons-material/Person';
import { User } from '../../types/user';

export default function UserIcon({ user }: { user?: User }) {
    return (
        <div css={iconStyle}>
            {user?.image ? <img width="100%" height="100%" src={user.image} alt="icon" /> : <PersonIcon htmlColor="white" />}
        </div >
    );
}

const iconStyle = (theme: Theme) => css`
    background: ${theme.palette.secondary.main};
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
`
