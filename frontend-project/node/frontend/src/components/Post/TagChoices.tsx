/** @jsxImportSource @emotion/react */

import React, { useState } from "react";
import { css } from "@emotion/react";
import TagChip from "../common/TagChip";
import TagModal from "./TagModal";

interface Props {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TagChoices(props: Props) {
  const { selectedTags, setSelectedTags } = props;
  const [choiceIsOpen, setChoiceIsOpen] = useState<boolean>(false);

  return (
    <>
      <div css={wrapperStyle} onClick={() => setChoiceIsOpen(true)}>
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => <TagChip key={tag} name={tag} />)
        ) : (
          <div css={noTagStyle}>タップしてタグを選択</div>
        )}
      </div>
      {choiceIsOpen && (
        <TagModal
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          onClose={() => setChoiceIsOpen(false)}
        />
      )}
    </>
  );
}

const wrapperStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: 32px;
`;

const noTagStyle = css`
  color: #767878;
`;
