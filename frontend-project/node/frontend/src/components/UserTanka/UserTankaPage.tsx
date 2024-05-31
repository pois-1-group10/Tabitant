/** @jsxImportSource @emotion/react */

import React, { useContext, useEffect } from "react";
import { css } from "@emotion/react";
import BackButton from "../common/BackButton";
import TankaList from "../common/TankaList";
import SortButton from "../common/SortButton";
import { PostListContext } from "../../providers/PostListProvider";
import { useParams } from "react-router-dom";

export default function UserTankaPage() {
  const { posts, fetchPosts } = useContext(PostListContext);
  const params = useParams();
  const userId = Number(params.userId);

  useEffect(() => {
    fetchPosts({ user_id: userId });
  }, []);

  return (
    <div css={backgroundStyle}>
      <BackButton />
      <SortButton style={sortButtonStyle} onClick={() => null} />
      <div css={sectionTitleStyle}>短歌一覧</div>
      <TankaList posts={posts} />
    </div>
  );
}

const backgroundStyle = css`
  background: linear-gradient(to bottom, #ffffff, #ff981f 50%);
  padding: 24px;
  height: calc(100vh - 48px);
  width: calc(100vw - 48px);
  overflow: scroll;
`;

const sectionTitleStyle = css`
  margin-top: 60px;
  font-size: 24px;
  text-align: left;
`;

const sortButtonStyle = css`
  left: initial;
  right: 20px;
`;
