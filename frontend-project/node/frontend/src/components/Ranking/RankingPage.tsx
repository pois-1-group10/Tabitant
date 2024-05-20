/** @jsxImportSource @emotion/react */

import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Box, Tab, Tabs, Typography } from '@mui/material';
import type { Swiper as SwiperCore } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Theme, css } from '@emotion/react'
import NavigationMenu from '../common/NavigationMenu';
import { Post } from '../../types/post';
import { PostListContext, PostListProvider } from '../../providers/PostListProvider';
import PostItem from '../common/PostItem';

type TabPanelProps = React.PropsWithChildren<{
    value: number;
    index: number;
}>;

type TabType = "popular" | "latest" | "past";
const tabTypes: TabType[] = ["popular", "latest", "past"];
const tabLabels: string[] = ["人気", "新着", "過去の投稿"];

function TabPanel({ value, index }: TabPanelProps) {
    const { posts, loading, fetchPosts } = useContext(PostListContext);
    const [fetched, setFetched] = useState(false);

    const isShown = !loading && value === index;

    useEffect(() => {
        // 未取得であれば取得する
        if (isShown && !fetched) {
            fetchPosts({}).then(() => {
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
            <div css={containerStyle}>
                {isShown && (
                    posts.map(p =>
                        <div key={p.id} css={cardStyle}>
                            <PostItem post={p} />
                        </div>
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
                        {tabTypes.map((t, i) => <Tab key={t} css={value == i ? tabStyleSelected : tabStyle} {...tabProps(i)} />)}
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