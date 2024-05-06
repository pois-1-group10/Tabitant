/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import { useParams } from "react-router-dom";
import BackButton from "../common/BackButton";
import Card from "../common/Card";
import TagChip from "../common/TagChip";

import thumbUpIcon from "../../img/thumb_up.svg";
import thumbDownIcon from "../../img/thumb_down.svg";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

export default function PostDetailPage() {
	const params = useParams();
	const id = params.id;
	return (
		<div css={backgroundStyle}>
			<BackButton />
			<Card style={cardStyle}>
        <div css={postCardHeaderStyle}>
          <img src="" alt="icon" css={iconStyle} />
          <div css={postCardHeaderContentStyle}>
            <div css={tagsWrapperStyle}>
              <TagChip name="日常" />
              <TagChip name="自然" />
            </div>
            <div css={areaPositionWrapperStyle}>
              <div css={areaPositionTextStyle}>
                <div className="area">エリア</div>
                <div className="position">詳細位置</div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div css={mainTextWrapperStyle}>
					<p>ああ</p>
					<p>あああ</p>
					<p></p>
					<p></p>
					<p></p>
				</div>
				<div css={reactionButtonWrapperStyle}>
					<div>
						<img src={thumbUpIcon} alt="" />
						<div css={thumbCountStyle}>0</div>
					</div>
					<div>
						<img src={thumbDownIcon} alt="" />
						<div css={thumbCountStyle}>0</div>
					</div>
				</div>
				<div css={commentInputWrapperStyle}>
					<img src="" alt="icon" css={selfIconStyle} />
					<CommentInput />
				</div>
      </Card>
			<Card style={cardStyle}>
				<div css={commentTitleStyle}>コメント</div>
				<CommentItem />
				<CommentItem />
				<CommentItem />
			</Card>
		</div>
	)
}

const backgroundStyle = css`
  background: linear-gradient(to bottom, #ffffff, #ff981f 50%);
  padding: 24px;
  height: calc(100vh - 48px);
  width: calc(100vw - 48px);
  overflow: scroll;
`;

const cardStyle = css`
  width: 100%;
  margin-top: 24px;
`;

const postCardHeaderStyle = css`
  width: 100%;
  display: flex;
  gap: 4px;
`;

const tagsWrapperStyle = css`
	display: flex;
	gap: 8px;
	align-items: center;
	height: 32px;
`;

const iconStyle = css`
  height: 40px;
  width: 40px;
  border-radius: 20px;
  border: 1px solid #303030;
`;

const selfIconStyle = css`
  height: 32px;
  width: 32px;
  border-radius: 16px;
  border: 1px solid #303030;
`;

const postCardHeaderContentStyle = css`
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  gap: 8px;
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
    font-size: 24px;
    font-weight: bold;
  }
  .position {
    font-size: 14px;
  }
`;

const reactionButtonWrapperStyle = css`
	margin-top: 40px;
	display: flex;
	justify-content: space-evenly;
	height: 32px;
	img {
		height: 24px;
		width: 24px;
	}
`;

const thumbCountStyle = css`
	font-size: 12px;
`;

const commentInputWrapperStyle = css`
	margin-top: 16px;
	display: flex;
	align-items: start;
	gap: 8px;
`;

const commentTitleStyle = css`
	font-size: 24px;
	text-align: left;
	padding: 0 4px;
	color: #767878;
`;
