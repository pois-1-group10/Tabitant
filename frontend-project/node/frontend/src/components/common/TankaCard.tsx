/** @jsxImportSource @emotion/react */

import React, { ReactElement, ReactNode } from "react";
import { SerializedStyles, css } from "@emotion/react";
import Card from "./Card";
import TagChip from "./TagChip";
import { ChartData, DetailPost } from "../../types/post";
import { Link } from "react-router-dom";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

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

  const chartData: ChartData[] = post
    ? [
        {
          emotion: "嬉",
          score: post.emotion_ureshii,
          fullMark: 3,
        },
        {
          emotion: "笑",
          score: post.emotion_shimijimi,
          fullMark: 3,
        },
        {
          emotion: "寂",
          score: post.emotion_samishii,
          fullMark: 3,
        },
        {
          emotion: "沁",
          score: post.emotion_shimijimi,
          fullMark: 3,
        },
        {
          emotion: "穏",
          score: post.emotion_odayaka,
          fullMark: 3,
        },
        {
          emotion: "怒",
          score: post.emotion_ikari,
          fullMark: 3,
        },
      ]
    : [];

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
          <div css={chartContainerStyle}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid gridType="circle" />
                <PolarAngleAxis dataKey="emotion" tick={{ dy: 5 }} />
                <Radar
                  dataKey="score"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
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
  flex-wrap: wrap;
  gap: 8px;
  margin: 4px 0;
  align-items: center;
`;

const postCardHeaderContentWrapperStyle = css`
  display: flex;
  width: 100%;
`;

const chartContainerStyle = css`
  width: 120px;
  height: 120px;
  font-size: 14px;
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
