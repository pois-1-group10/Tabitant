/** @jsxImportSource @emotion/react */

import React, { FC, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { css } from "@emotion/react";

import goldMedalIcon from "../../img/gold_medal.png";
import silverMedalIcon from "../../img/silver_medal.png";
import bronzeMedalIcon from "../../img/bronze_medal.png";
import Card from "../common/Card";
import TankaCard from "../common/TankaCard";
import HamburgerButton from "../common/HamburgerButton";
import Sidebar from "./Sidebar";
import { UserDetailContext } from "../../providers/UserDetailProvider";
import NavigationMenu from "../common/NavigationMenu";
import { AuthUserContext } from "../../providers/AuthUserProvider";
import { UserAPI } from "../../api/User";
import SimilarUserList from "./SimilarUserList";
import { SimilarUserProvider } from "../../providers/SimilarUserProvider";
import { awardToString } from "../../utils/award";
import { Award } from "../../types/award";
import { AnimatePresence } from "framer-motion";
import UserIcon from "../common/UserIcon";

export default function UserProfilePage() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(false);
  const [following, setFollowing] = useState<boolean | undefined>();
  const { user, fetchUserDetail } = useContext(UserDetailContext);
  const { currentUser } = useContext(AuthUserContext);
  const params = useParams();
  const userId = params.id;

  const myPage = Number(userId) === currentUser?.id;

  const backgroundStyle = css`
    position: relative;
    background: linear-gradient(to bottom, #ffffff, #ff981f 50%);
    padding: 24px;
    height: calc(100vh - 48px);
    width: calc(100vw - 48px);
    overflow: ${sidebarIsOpen ? "hidden" : "scroll"};
    overflow-x: hidden;
  `;

  const onClickFollow = async () => {
    user && (await UserAPI.follow(user.id));
    setFollowing(true);
  };

  const onClickUnfollow = async () => {
    user && (await UserAPI.unfollow(user.id));
    setFollowing(false);
  };

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  useEffect(() => {
    if (user?.followed !== undefined) {
      if (user?.followed) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    }
  }, [user]);

  return (
    <div css={backgroundStyle}>
      <HamburgerButton
        style={hamburgerButtonStyle}
        onClick={() => setSidebarIsOpen(true)}
      />
      <NavigationMenu home ranking post logout profile={!myPage} />
      <AnimatePresence>
        {sidebarIsOpen && <Sidebar setSidebarIsOpen={setSidebarIsOpen} />}
      </AnimatePresence>
      <div css={profileHeaderStyle}>
        <div css={userIconStyle}>
          <UserIcon user={user} style={innerUserIconStyle} />
        </div>
        <div css={userInfoStyle}>
          <div className="user-name">{user?.username}</div>
          <div css={followDataStyle}>
            <Link to="followee/" css={navigatingBlockStyle}>
              <div className="number">{user?.followee_num}</div>
              <div className="type">フォロー</div>
            </Link>
            <Link to="follower/" css={navigatingBlockStyle}>
              <div className="number">{user?.follower_num}</div>
              <div className="type">フォロワー</div>
            </Link>
            <Link to={`/favorite/${userId}`} css={navigatingBlockStyle}>
              <div className="number">{user?.like_num}</div>
              <div className="type">いいね</div>
            </Link>
          </div>
        </div>
      </div>
      <p css={bioTextStyle}>{user?.userprofile?.bio}</p>
      {!myPage &&
        following !== undefined &&
        (following ? (
          <UnfollowButton onClick={onClickUnfollow} />
        ) : (
          <FollowButton onClick={onClickFollow} />
        ))}
      <hr />
      {user?.id === currentUser?.id && (
        <>
          <div css={sectionTitleStyle}>ディスカバー</div>
          <SimilarUserProvider>
            <SimilarUserList />
          </SimilarUserProvider>
        </>
      )}
      {user?.userprofile?.default_post && (
        <>
          <div css={sectionTitleStyle}>短歌</div>
          <TankaCard
            style={tankaCardStyle}
            post={user?.userprofile?.default_post}
            link
          />
        </>
      )}
      {user?.awards && (
        <>
          <div css={sectionTitleStyle}>受賞歴</div>
          <Card style={awardCardStyle}>
            {user.awards.length > 0 ? (
              user.awards.map((award) => (
                <AwardItem key={award.id} award={award} />
              ))
            ) : (
              <div css={noAwardStyle}>受賞歴はありません</div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

interface InnerProps {
  onClick: (e: React.MouseEvent) => void;
}

const FollowButton: FC<InnerProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} css={followButtonStyle}>
      フォローする
    </button>
  );
};

const UnfollowButton: FC<InnerProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} css={unfollowButtonStyle}>
      フォロー解除
    </button>
  );
};

interface AwardProps {
  award: Award;
}

const AwardItem: FC<AwardProps> = ({ award }) => {
  return (
    <div css={awardItemStyle}>
      {award.rank === 1 ? (
        <img src={goldMedalIcon} alt="" css={medalIconStyle} />
      ) : award.rank === 2 ? (
        <img src={silverMedalIcon} alt="" css={medalIconStyle} />
      ) : award.rank === 3 ? (
        <img src={bronzeMedalIcon} alt="" css={medalIconStyle} />
      ) : (
        <div css={medalIconStyle}></div>
      )}
      <span>{awardToString(award)}</span>
    </div>
  );
};

const profileHeaderStyle = css`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 24px;
  height: 112px;
`;

const userIconStyle = css`
  height: 96px;
  width: 96px;
  border: 1px solid #767878;
  border-radius: 48px;
  flex-shrink: 0;
`;

const innerUserIconStyle = css`
  * {
    font-size: 80px !important;
  }
`;

const userInfoStyle = css`
  display: flex;
  flex-flow: column;
  justify-content: end;
  gap: 8px;
  flex-grow: 1;
  height: 100%;
  max-width: calc(100% - 120px);
  .user-name {
    text-align: left;
    font-size: 20px;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const followDataStyle = css`
  display: flex;
  justify-content: space-between;
  .number {
    font-weight: bold;
    text-align: center;
  }
  .type {
    font-size: 12px;
    color: #767878;
  }
`;

const bioTextStyle = css`
  font-size: 14px;
  margin: 16px 8px 8px;
  text-align: left;
`;

const sectionTitleStyle = css`
  font-size: 24px;
  text-align: left;
`;

const tankaCardStyle = css`
  background-color: rgba(255, 255, 255, 0.5);
`;

const awardCardStyle = css`
  background-color: rgba(255, 255, 255, 0.5);
  width: 100%;
  min-height: 60px;
  padding: 12px;
`;

const navigatingBlockStyle = css`
  display: block;
  text-decoration: none;
  color: initial;
`;

const hamburgerButtonStyle = css`
  position: absolute;
  left: initial;
  right: 20px;
  top: 20px;
`;

const followButtonStyle = css`
  outline: none;
  appearance: none;
  height: 32px;
  width: 100%;
  background-color: #ff981f;
  border: 1px solid #303030;
  border-radius: 16px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.5);
  font-size: 14px;
  color: #fff;
`;

const unfollowButtonStyle = css`
  outline: none;
  appearance: none;
  height: 32px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #303030;
  border-radius: 16px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.5);
  font-size: 14px;
  color: #ff981f;
`;

const awardItemStyle = css`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 8px;
  height: 24px;
  margin-bottom: 4px;
`;

const medalIconStyle = css`
  height: 24px;
  width: 24px;
`;

const noAwardStyle = css`
  text-align: center;
  font-size: 14px;
`;
