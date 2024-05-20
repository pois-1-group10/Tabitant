/** @jsxImportSource @emotion/react */

import { nanoid } from "nanoid";
import { useContext, useState } from "react";
import { Theme, css } from "@emotion/react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from "@mui/icons-material/Home";
import { UserAuthAPI } from "../../api/UserAuth";
import { AuthUserContext } from "../../providers/AuthUserProvider";

interface Props {
  post?: boolean;
  home?: boolean;
  ranking?: boolean;
  profile?: boolean;
  logout?: boolean;
  login?: boolean;
}

export default function NavigationMenu(props: Props) {
  const { post, home, ranking, profile, logout, login } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentUser } = useContext(AuthUserContext);

  const onClickLogout = async () => {
    sessionStorage.removeItem("token");
    await UserAuthAPI.logout();
  };

  return (
    <>
      <div css={[menuStyle, isExpanded && frontStyle]}>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              css={linkStyle}
              key="links"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              {currentUser && post && (
                <Link to="/post">
                  <EditIcon />
                  <span>投稿を作成</span>
                </Link>
              )}
              {home && (
                <Link to="/">
                  <HomeIcon />
                  <span>ホーム</span>
                </Link>
              )}
              {currentUser && ranking && (
                <Link to="/ranking">
                  <StarBorderIcon />
                  <span>ランキング</span>
                </Link>
              )}
              {currentUser && profile && (
                <Link to={`/user_profile/${currentUser.id}/`}>
                  <PersonIcon />
                  <span>マイページ</span>
                </Link>
              )}
              {currentUser && logout && (
                <Link to="/login?signin" onClick={onClickLogout}>
                  <LogoutIcon />
                  <span>ログアウト</span>
                </Link>
              )}
              {!currentUser && login && (
                <Link to="/login?signin">
                  <LoginIcon />
                  <span>ログイン</span>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          css={buttonStyle}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <motion.div
            css={buttonLineStyle}
            animate={{
              y: isExpanded ? 3 : -5,
              rotate: isExpanded ? 45 : 0,
            }}
            transition={buttonLineTransition}
          />
          <motion.div
            css={buttonLineStyle}
            animate={{
              opacity: isExpanded ? 0 : 1,
            }}
            transition={buttonLineTransition}
          />
          <motion.div
            css={buttonLineStyle}
            animate={{
              y: isExpanded ? -3 : 5,
              rotate: isExpanded ? -45 : 0,
            }}
            transition={buttonLineTransition}
          />
        </button>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            css={overlayStyle}
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

const menuStyle = css`
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-flow: column;
  z-index: 100;
`;

const linkStyle = (theme: Theme) => css`
  overflow: hidden;

  > a {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 10px;
    margin: 4px 0;
    border-radius: 10px;
    background: ${theme.palette.background.paper};
    text-decoration: none;
    color: ${theme.palette.secondary.dark};
    cursor: pointer;

    span {
      margin-left: 6px;
    }
  }
`;

const buttonStyle = (theme: Theme) => css`
  width: 50px;
  height: 50px;
  background: ${theme.palette.primary.main};
  border: none;
  border-radius: 10px;
	box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.5);
  padding: 0 12px;
  cursor: pointer;
`;

const buttonLineStyle = css`
  width: 100%;
  height: 3px;
  background-color: white;
`;

const buttonLineTransition = {
  type: "linear",
  duration: 0.15,
};

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
`;

const frontStyle = css`
  z-index: 1000;
`;
