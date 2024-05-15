/** @jsxImportSource @emotion/react */

import React, { ReactElement, ReactNode } from "react";
import { SerializedStyles, css } from "@emotion/react";
import Card from "./Card";
import TagChip from "./TagChip";
import { DetailPost } from "../../types/post";
import { Link } from "react-router-dom";

interface Props {
  post?: DetailPost;
  link?: boolean;
  icon?: ReactElement;
  style?: SerializedStyles;
  children?: ReactNode;
}

export default function TankaCard(props: Props) {
  const { post, link = false, icon, style, children } = props;
  const concatenatedStyle = css`
    ${cardStyle}
    ${style}
  `;
  const cardProps = post && link ? { to: `/post_detail/${post?.id}` } : {};
  return (
    <Card style={concatenatedStyle} {...cardProps}>
      <div css={postCardHeaderStyle}>
        <Link to={`/user_profile/${post?.user.id}`} css={userInfoStyle}>
          {icon}
          <p>{post?.user.username}</p>
        </Link>
        <div css={postCardHeaderContentStyle}>
          <div css={tagsWrapperStyle}>
            <TagChip name="日常" />
            <TagChip name="自然" />
          </div>
          <div css={areaPositionWrapperStyle}>
            <div css={areaPositionTextStyle}>
              <div className="area">{post?.prefecture?.name}</div>
              <div className="position">詳細位置</div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div css={mainTextWrapperStyle}>
        <p>{post?.content_1}</p>
        <p>{post?.content_2}</p>
        <p>{post?.content_3}</p>
        <p>{post?.content_4}</p>
        <p>{post?.content_5}</p>
      </div>
      {children}
    </Card>
  );
}

const cardStyle = css`
  width: 100%;
`;

const postCardHeaderStyle = css`
  width: 100%;
  display: flex;
  flex-flow: column;
  gap: 4px;
`;

const tagsWrapperStyle = css`
  display: flex;
  gap: 8px;
  align-items: center;
  height: 32px;
`;

const postCardHeaderContentStyle = css`
  display: flex;
  flex-flow: column;
  flex-grow: 1;
`;

const userInfoStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  color: initial;
  text-decoration: none;
  p {
    margin: 0;
    font-weight: bold;
  }
`;

const mainTextWrapperStyle = css`
  writing-mode: vertical-rl;
  border: none;
  width: 100%;
  text-align: left;
  overflow: scroll;
  line-height: 40px;
  letter-spacing: 8px;
  font-size: 24px;
  p {
    margin: 0 20px;
    white-space: nowrap;
  }
`;

const areaPositionWrapperStyle = css`
  width: 100%;
`;

const areaPositionTextStyle = css`
  width: 80%;
  text-align: left;
  .area {
    font-size: 20px;
    font-weight: bold;
  }
  .position {
    font-size: 14px;
  }
`;
