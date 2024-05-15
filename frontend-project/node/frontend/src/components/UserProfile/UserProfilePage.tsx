/** @jsxImportSource @emotion/react */

import React, { useContext, useEffect, useState } from "react";
import { css } from "@emotion/react";
import Card from "../common/Card";
import TankaCard from "../common/TankaCard";
import HamburgerButton from "../common/HamburgerButton";
import Sidebar from "./Sidebar";
import { Link, useParams } from "react-router-dom";
import { UserDetailContext } from "../../providers/UserDetailProvider";
import NavigationMenu from "../common/NavigationMenu";

export default function UserProfilePage() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(false);
  const { user, fetchUserDetail } = useContext(UserDetailContext);
  const params = useParams();
  const userId = params.id;

  const backgroundStyle = css`
    position: relative;
    background: linear-gradient(to bottom, #ffffff, #ff981f 50%);
    padding: 24px;
    height: calc(100vh - 48px);
    width: calc(100vw - 48px);
    overflow: ${sidebarIsOpen ? "hidden" : "scroll"};
  `;

  useEffect(() => {
    fetchUserDetail();
  }, []);

  return (
    <div css={backgroundStyle}>
      <HamburgerButton
        style={hamburgerButtonStyle}
        onClick={() => setSidebarIsOpen(true)}
      />
      <NavigationMenu home ranking post />
      {sidebarIsOpen && <Sidebar setSidebarIsOpen={setSidebarIsOpen} />}
      <div css={profileHeaderStyle}>
        <img src="" alt="" css={userIconStyle} />
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
      <p css={bioTextStyle}>
        {user?.userprofile?.bio}
      </p>
      <hr />
      <div css={sectionTitleStyle}>短歌</div>
      <TankaCard style={tankaCardStyle} link/>
      <div css={sectionTitleStyle}>受賞歴</div>
      <Card style={awardCardStyle}></Card>
    </div>
  );
}

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
  min-height: 120px;
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
