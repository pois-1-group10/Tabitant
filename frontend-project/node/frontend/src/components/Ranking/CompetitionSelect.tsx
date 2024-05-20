/** @jsxImportSource @emotion/react */

import React, { useContext, useEffect, useState } from 'react';
import { Competition } from '../../types/award';
import YearMonthPicker, { YearMonth } from './YearMonthPicker';
import { CompetitionListContext } from '../../providers/CompetitionListProvider';
import { Theme, css } from '@emotion/react';

type Props = {
  onChanged?: (competition: Competition | null) => void;
}

export default function CompetitionSelect(props: Props) {
  const { onChanged } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { competitions, fetchCompetitions } = useContext(CompetitionListContext);

  const handleDateChange = (date: YearMonth) => {
    fetchCompetitions({ year: date.year, month: date.month }).then((competitions) => {
      if (competitions === null) return;
      if (onChanged) {
        onChanged(competitions.length ? competitions[selectedIndex] : null);
      }
    });
  };

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const selected = Number(event.target.value);
    setSelectedIndex(selected);
    if (onChanged) {
      onChanged(competitions.length ? competitions[selected] : null);
    }
  };

  const today = new Date();

  return (
    <div>
      <YearMonthPicker endDate={{ year: today.getFullYear(), month: today.getMonth() + 1 }} totalMonths={24} onDateChanged={handleDateChange} />
      <div css={containerStyle}>
        <span>エリア:</span>
        <select css={selectStyle} value={selectedIndex.toString()} onChange={handleChange} disabled={competitions.length === 0}>
          {competitions.length ? competitions.map((c, i) => (
            <option key={c.id} value={i}>{c.prefecture.name}</option>
          )) : (
            <option value={0}>大会がありません</option>
          )}
        </select>
      </div>
    </div>
  );
}

const containerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  color: dimgray;
`

const selectStyle = (theme: Theme) => css`
  background-color: transparent;
  font-size: 16px;
  border-radius: 10px;
  padding: 5px;
  margin: 0 10px;

  &:disabled {
    color: ${theme.palette.secondary.dark};
    border-color: ${theme.palette.secondary.dark};
  }
`;
