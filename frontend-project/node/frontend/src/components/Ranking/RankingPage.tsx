/** @jsxImportSource @emotion/react */

import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Box, Tab, Tabs } from '@mui/material';
import type { Swiper as SwiperCore } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Theme, css } from '@emotion/react'
import NavigationMenu from '../common/NavigationMenu';
import { PostListContext, PostListProvider } from '../../providers/PostListProvider';
import PostItem from '../common/PostItem';
import { CompetitionListContext } from '../../providers/CompetitionListProvider';
import CompetitionSelect from './CompetitionSelect';
import { PostListParams } from '../../types/post';
import { Competition } from '../../types/award';

type TabPanelProps = React.PropsWithChildren<{
  value: number;
  index: number;
}>;

type TabType = "competition" | "popular" | "latest";
const tabTypes: TabType[] = ["competition", "popular", "latest"];
const tabLabels: string[] = ["大会", "人気", "新着"];

function TabPanel({ value, index }: TabPanelProps) {
  const { posts, loading, fetchPosts } = useContext(PostListContext);
  const [fetched, setFetched] = useState(false);
  const tabType = tabTypes[index];
  const isShown = !loading && value === index;

  const fetchCompetitionPosts = (competition: Competition | null) => {
    if (competition === null) return;
    fetchPosts({ compe_id: competition.id, ranking: true }).then(() => {
      setFetched(true);
    });
  };

  useEffect(() => {
    // 未取得であれば取得する
    // competition は fetchCompetitionPosts で取得する
    if (isShown && !fetched && tabType !== 'competition') {
      let params: PostListParams = {};
      if (tabType === 'popular') {
        params.ranking = true;
      } else {
        params.latest = true;
      }
      fetchPosts(params).then(() => {
        setFetched(true);
      });
    }
  }, [value])

  return (
    <div
      role="tabpanel"
      hidden={!isShown}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
    >
      {
        tabType === "competition" && (
          <CompetitionSelect onChanged={fetchCompetitionPosts} />
        )
      }
      <div css={containerStyle}>
        {isShown && (
          posts.length ? (
            posts.map(p =>
              <div key={p.id} css={cardStyle}>
                <PostItem post={p} />
              </div>
            )) : (
            <div>投稿がありません</div>
          )
        )}
      </div>
    </div>
  );
}

function tabProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
    label: tabLabels[index],
  };
}

export default function RankingPage() {
  const [swiper, setSwiper] = React.useState<SwiperCore | null>(null);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    swiper?.slideTo(newValue);
  };
  const onSwiper = (currentSwiper: SwiperCore) => {
    const swiperInstance = currentSwiper;
    setSwiper(swiperInstance);
  };
  const onSlideChange = (currentSwiper: SwiperCore) => {
    setValue(currentSwiper.activeIndex);
  };

  return (
    <>
      <Box sx={{ bgcolor: 'background.paper', width: 1 }}>
        <AppBar position="sticky">
          <Tabs
            css={tabHeaderStyle}
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ sx: { backgroundColor: "primary.contrastText" } }}
            variant="fullWidth"
          >
            {tabTypes.map((t, i) => <Tab key={t} css={value === i ? tabStyleSelected : tabStyle} {...tabProps(i)} />)}
          </Tabs>
        </AppBar>
        <Swiper
          simulateTouch={true}
          onSwiper={onSwiper}
          onSlideChange={onSlideChange}
        >
          {tabTypes.map((t, i) =>
            <SwiperSlide key={t}>
              <PostListProvider>
                <TabPanel value={value} index={i} />
              </PostListProvider>
            </SwiperSlide>
          )}
        </Swiper>
      </Box>
      <NavigationMenu post home profile logout />
    </>
  );
}

const tabHeaderStyle = css`
`

const tabStyle = (theme: Theme) => css`
  color: ${theme.palette.primary.contrastText};
`

const tabStyleSelected = (theme: Theme) => css`
  ${tabStyle(theme)}
  color: white !important;
  font-weight: bold;
`

const containerStyle = css`
  display: flex;
  flex-flow: column;
  padding: 10px;
`

const cardStyle = css`
  margin: 10px;
  background-color: white;
  border: solid 1px black;
  border-radius: 16px;
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.4);
`