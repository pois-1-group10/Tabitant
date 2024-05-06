/** @jsxImportSource @emotion/react */

import React, { useCallback, useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { css } from '@emotion/react'
import { Post, User, Tanka } from '../../models';
import Marker from './Marker'

const users: User[] = [
    new User("1", "ユーザー1", null),
    new User("2", "ユーザー2", null),
    new User("3", "ユーザー3", null),
];

async function getPosts(position: google.maps.LatLng): Promise<Post[]> {
    // 周辺の投稿を取得する
    return [
        new Post("1", users[0], new Tanka(["雨の日の", "下校のときに", "見た枝は", "くもの巣さえも", "美しきかな"]),
            new google.maps.LatLng(35.026244, 135.780822)),
        new Post("2", users[1], new Tanka(["また今日も", "いつものように", "けんかだね", "姉妹みたいだ", "母と私と"]),
            new google.maps.LatLng(35.025254, 135.781832)),
    ]
}

function Map(center: google.maps.LatLngLiteral) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [posts, setPosts] = useState<Post[] | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, [])

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, [])

    useEffect(() => {
        getPosts(new google.maps.LatLng(center))
            .then((res) => setPosts(res));
    }, [])

    return (
        <>
            <div css={mapWrapperStyle}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={16}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={mapOptions()}>
                    {posts && posts.map(post => <Marker key={post.id} post={post} />)}
                </GoogleMap>
            </div>
        </>
    );
}

export default React.memo(Map)

const mapWrapperStyle = css`
    width: 100%;
    height: 100vh;
    height: 100dvh;
`

const containerStyle = {
    width: "100%",
    height: "100%",
}

const mapOptions = () => ({
    streetViewControl: false,
    scaleControl: true,
    fullscreenControl: false,
    disableDoubleClickZoom: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    zoomControl: true,
    clickableIcons: false,
    gestureHandling: "greedy"
});
