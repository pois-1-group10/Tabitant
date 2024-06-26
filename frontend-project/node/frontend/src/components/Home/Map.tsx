/** @jsxImportSource @emotion/react */

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { GoogleMap } from '@react-google-maps/api';
import { css } from '@emotion/react'
import Marker from './Marker'
import { PostListContext } from '../../providers/PostListProvider';
import { MapLocationContext } from '../../providers/MapLocationProvider';

function Map() {
    const { posts, fetchPosts } = useContext(PostListContext);
    const { center, zoom, setCurrentLocation } = useContext(MapLocationContext);
    const [map, setMap] = useState<google.maps.Map | null>(null);

    if (center.lat === undefined) {
        setCurrentLocation();
    }

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, [])

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, [])

    return (
        <>
            <div css={mapWrapperStyle}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={new google.maps.LatLng(center.lat ?? 35, center.lng ?? 135)}
                    zoom={zoom}
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
