/** @jsxImportSource @emotion/react */

import React, { FC, useContext } from "react";
import { css } from "@emotion/react";

import thumbUpIcon from "../../img/thumb_up.svg";
import thumbDownIcon from "../../img/thumb_down.svg";
import Card from "./Card";
import { Link } from "react-router-dom";
import { Post } from "../../types/post";
import { PostListContext } from "../../providers/PostListProvider";
import { tankaFromPost } from "../../utils/tanka";

type Props = {
  posts: Post[];
};

export default function TankaList(props: Props) {
  const { posts } = useContext(PostListContext);

  return (
    <Card style={cardStyle}>
      {posts.map((post) => (
        <>
          <TankaItem post={post} />
          <div css={lineStyle} />
        </>
      ))}
    </Card>
  );
}

type InnerProps = {
	post: Post
};

const TankaItem: FC<InnerProps> = ({ post }) => {
  return (
    <Link to={`/post_detail/${post.id}/`} css={tankaItemStyle}>
      <div css={tankaContentStyle}>{tankaFromPost(post)}</div>
      <div css={tankaInfoStyle}>
        <div css={reactionWrapperStyle}>
          <div css={reactionBlockStyle}>
            <img src={thumbUpIcon} alt="" />
            <span>{post.good_count}</span>
          </div>
          <div css={reactionBlockStyle}>
            <img src={thumbDownIcon} alt="" />
            <span>{post.bad_count}</span>
          </div>
        </div>
        <span css={dateStyle}>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>
    </Link>
  );
};

const cardStyle = css`
  display: flex;
  flex-flow: column;
  gap: 4px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
`;

const lineStyle = css`
  width: 95%;
  margin: 0 auto;
  border-top: 1px solid #767878;
`;

const tankaItemStyle = css`
  display: block;
  text-decoration: none;
  color: initial;
  width: 95%;
  margin: 4px auto;
`;

const tankaContentStyle = css`
  font-size: 14px;
  margin-bottom: 4px;
`;

const tankaInfoStyle = css`
  display: flex;
  justify-content: space-between;
`;

const reactionWrapperStyle = css`
  display: flex;
  gap: 8px;
`;

const reactionBlockStyle = css`
  display: flex;
  align-items: center;
  img {
    height: 16px;
    width: 16px;
  }
  span {
    font-size: 12px;
  }
`;

const dateStyle = css`
  color: #767878;
  font-size: 12px;
`;
