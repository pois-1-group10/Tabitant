/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";

import Card from "../common/Card";
import TagChip from "../common/TagChip";
import CancelButton from "../common/CancelButton";
import { tags } from "../../utils/constants";

interface TagModalProps {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
}

export default function TagModal({
  selectedTags,
  setSelectedTags,
  onClose,
}: TagModalProps) {
  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(
        selectedTags.filter((selectedTag) => selectedTag !== tag)
      );
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <Card style={modalStyle}>
      <div css={cancelButtonWrapperStyle}>
        <span>タグ</span>
        <CancelButton onClick={onClose} style={cancelButtonStyle} />
      </div>
      <div css={tagsWrapperStyle}>
        {tags.map((tag) => (
          <TagChip
            key={tag}
            name={tag}
            onClick={() => handleTagClick(tag)}
            selected={selectedTags.includes(tag)}
          />
        ))}
      </div>
    </Card>
  );
}

const modalStyle = css`
  position: absolute;
  top: -24px;
  right: -16px;
  width: 70vw;
  background-color: #fff;
	display: flex;
	flex-flow: column;
  justify-content: center;
  align-items: center;
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.3);
	z-index: 200;
`;

const cancelButtonWrapperStyle = css`
  position: relative;
  height: 32px;
  width: 100%;
  span {
    line-height: 32px;
    font-weight: bold;
    padding: 0 8px;
    color: #767878;
  }
`;

const cancelButtonStyle = css`
  position: absolute;
  left: initial;
  top: 0;
  right: 8px;
  height: 24px;
  width: 24px;
  img {
    height: 12px;
    width: 12px;
  }
`;

const tagsWrapperStyle = css`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  gap: 8px;
`;
