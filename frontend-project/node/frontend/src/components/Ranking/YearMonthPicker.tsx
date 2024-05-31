/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { Theme, css } from '@emotion/react'

export type YearMonth = {
  year: number;
  month: number;
}

function lt(d1: YearMonth, d2: YearMonth) {
  return d1.year < d2.year || d1.year === d2.year && d1.month < d2.month;
}
function eq(d1: YearMonth, d2: YearMonth) {
  return d1.year === d2.year && d1.month === d2.month;
}

type Props = {
  endDate: YearMonth;
  totalMonths: number;
  onDateChanged?: (date: YearMonth) => void;
}

export default function YearMonthPicker(props: Props) {
  const { endDate, totalMonths, onDateChanged } = props;
  const [year, setYear] = useState(endDate.year);
  const [month, setMonth] = useState(endDate.month);

  const startDate = (() => {
    let year = endDate.year - Math.floor(totalMonths / 12);
    let restMonths = totalMonths % 12;
    if (endDate.month >= restMonths) {
      return { year: year, month: endDate.month - restMonths + 1 };
    } else {
      return { year: year - 1, month: endDate.month - restMonths + 13 };
    }
  })();

  const handleYearChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newYear = Number(event.target.value);
    let newDate: YearMonth = { year: newYear, month: month };
    if (lt(newDate, startDate)) newDate = startDate;
    else if (lt(endDate, newDate)) newDate = endDate;
    setYear(newDate.year);
    setMonth(newDate.month);
    if (onDateChanged) {
      onDateChanged(newDate);
    }
  };

  const handleMonthChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newMonth = Number(event.target.value);
    setMonth(newMonth);
    if (onDateChanged) {
      onDateChanged({ year: year, month: newMonth });
    }
  };

  useEffect(() => {
    if (onDateChanged) {
      onDateChanged({ year: year, month: month });
    }
  }, []);

  return (
    <div css={containerStyle} >
      {eq({ year: year, month: month }, endDate) ? (
        <div css={[annotationStyle, redTextStyle]}>
          開催中の大会
        </div>
      ) : (
        <div css={annotationStyle}>
          過去の大会
        </div>
      )}
      <div>
        <select value={year.toString()} onChange={handleYearChange}>
          {Array(endDate.year - startDate.year + 1).fill(0).map((_, i) => (
            <option key={i} value={startDate.year + i}>{startDate.year + i}</option>
          ))}
        </select>
        <span>年</span>
        <select value={month.toString()} onChange={handleMonthChange}>
          {(year == startDate.year ? Array(12 - startDate.month + 1).fill(startDate.month) :
            year == endDate.year ? Array(endDate.month).fill(1) : Array(12).fill(1))
            .map((v, i) => (
              <option key={i} value={v + i}>{v + i}</option>
            ))}
        </select>
        <span>月</span>
      </div>
    </div >
  );
}

const containerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  color: dimgray;

  select {
    background-color: transparent;
    font-size: 16px;
    border-radius: 10px;
    padding: 5px;
    margin: 0 10px;
  }
`;

const annotationStyle = (theme: Theme) => css`
  color: ${theme.palette.secondary.dark};
  background-color: #dddddd;
  padding: 6px 8px;
  border-radius: 10px;
  font-size: 14px;
`;

const redTextStyle = css`
  color: red;
  background-color: #ffe2e2;
`;
