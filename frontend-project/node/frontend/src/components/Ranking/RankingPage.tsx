/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { AppBar, Box, Tab, Tabs, Typography } from '@mui/material';
import type { Swiper as SwiperCore } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Theme, css } from '@emotion/react'
import { LatLng, Post, Tanka, User } from '../../models'
import TankaCard from '../common/TankaCard';
import UserIcon from '../common/UserIcon';
import { getDummyPosts, getDummyUsers } from '../../util';
import NavigationMenu from '../common/NavigationMenu';

type TabPanelProps = React.PropsWithChildren<{
    value: number;
    index: number;
}>;

type TabType = "popular" | "latest" | "past";
const tabTypes: TabType[] = ["popular", "latest", "past"];
const tabLabels: string[] = ["人気", "新着", "過去の投稿"];

const users = getDummyUsers();

async function getPosts(type: TabType): Promise<Post[]> {
    // 各タブの投稿を取得する
    return getDummyPosts({ users: users });
}

let tabPosts: (Post[] | undefined)[] = new Array(tabTypes.length);

function TabPanel({ value, index }: TabPanelProps) {
    const [isLoading, setIsLoading] = useState(false);

    const isShown = !isLoading && value === index;

    // 未取得であれば取得する
    if (isShown && tabPosts[index] === undefined) {
        setIsLoading(true);
        getPosts(tabTypes[index]).then(r => {
            tabPosts[index] = r;
            setIsLoading(false);
        });
    }

    return (
        <div
            role="tabpanel"
            hidden={!isShown}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
        >
            <div css={containerStyle}>
                {isShown && (
                    tabPosts[index]?.map(p =>
                        <div key={p.id} css={cardStyle}>
                            <TankaCard icon={UserIcon({ user: p.user })} link>
                                <div>{p.user?.username}</div>
                                <div>{p.content.toString()}</div>
                            </TankaCard>
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
                            <TabPanel value={value} index={i} />
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
    margin: 5px;
`