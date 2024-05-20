/** @jsxImportSource @emotion/react */

import { SerializedStyles, Theme, css } from '@emotion/react'
import PersonIcon from '@mui/icons-material/Person';
import { User } from '../../types/user';

type Props = {
    user?: User;
    style?: SerializedStyles;
};

export default function UserIcon(props: Props) {
    const { user, style } = props;
    return (
        <div css={[iconStyle, style, user?.image && borderStyle]}>
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
`;

const borderStyle = css`
    border: 1px solid #303030;
`;
