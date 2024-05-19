/** @jsxImportSource @emotion/react */

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { GoogleMap } from '@react-google-maps/api';
import { css } from '@emotion/react'
import Marker from './Marker'
import { PostListContext } from '../../providers/PostListProvider';

function Map(center: google.maps.LatLngLiteral) {
    const { posts, fetchPosts } = useContext(PostListContext);
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, [])

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, [])

    useEffect(() => {
        // fetchPosts({ lat: center.lat, lng: center.lng })
        fetchPosts({});
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
