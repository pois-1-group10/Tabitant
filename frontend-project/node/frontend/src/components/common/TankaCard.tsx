/** @jsxImportSource @emotion/react */

import React, { ReactElement, ReactNode } from "react";
import { SerializedStyles, css } from "@emotion/react";
import Card from "./Card";
import TagChip from "./TagChip";
import { DetailPost } from "../../types/post";
import { Link } from "react-router-dom";
import EmotionRadarChart from "./EmotionRadarChart";
import PostContent from "./PostContent";

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
        {icon && (
          <Link to={`/user_profile/${post?.user.id}`} css={userInfoStyle}>
            {icon}
            <p>{post?.user.username}</p>
          </Link>
        )}
        <div css={postCardHeaderContentWrapperStyle}>
          <div css={postCardHeaderContentStyle}>
            <div css={tagsWrapperStyle}>
              {post?.tags.map((tagName) => (
                <TagChip key={tagName} name={tagName} />
              ))}
            </div>
            <div css={areaPositionWrapperStyle}>
              <div css={areaPositionTextStyle}>
                <div className="area">{post?.prefecture?.name}</div>
                <div className="position">詳細位置</div>
              </div>
            </div>
          </div>
          <EmotionRadarChart 
            ureshii={post?.emotion_ureshii ?? 0} 
            omoshiroi={post?.emotion_omoshiroi ?? 0} 
            samishii={post?.emotion_samishii ?? 0} 
            shimijimi={post?.emotion_shimijimi ?? 0} 
            odayaka={post?.emotion_odayaka ?? 0} 
            ikari={post?.emotion_ikari ?? 0}
          />
        </div>
      </div>
      <hr />
      {post && <PostContent post={post} style={mainTextWrapperStyle} />}
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
  flex-wrap: wrap;
  gap: 8px;
  margin: 4px 0;
  align-items: center;
`;

const postCardHeaderContentWrapperStyle = css`
  display: flex;
  width: 100%;
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
  width: 100%;
  overflow: auto;
  font-size: 20px;
  margin-top: 20px;
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
