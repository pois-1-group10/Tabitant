/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { ChartData } from "../../types/post";

interface Props {
  ureshii: number;
  omoshiroi: number;
  samishii: number;
  shimijimi: number;
  odayaka: number;
  ikari: number;
}

export default function EmotionRadarChart(props: Props) {
  const chartData: ChartData[] = [
    {
      emotion: "嬉",
      score: props.ureshii,
      fullMark: 3,
    },
    {
      emotion: "笑",
      score: props.omoshiroi,
      fullMark: 3,
    },
    {
      emotion: "寂",
      score: props.samishii,
      fullMark: 3,
    },
    {
      emotion: "沁",
      score: props.shimijimi,
      fullMark: 3,
    },
    {
      emotion: "穏",
      score: props.odayaka,
      fullMark: 3,
    },
    {
      emotion: "怒",
      score: props.ikari,
      fullMark: 3,
    },
  ];
  
  return (
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
  );
}

const chartContainerStyle = css`
  width: 120px;
  height: 120px;
  font-size: 14px;
`;
