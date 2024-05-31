import React, { useCallback, useEffect, useState } from 'react'
import { MarkerF } from '@react-google-maps/api';
import { css } from '@emotion/react'
import { Post } from '../../types/post';
import { tankaFromPost } from '../../utils/tanka';
import InfoWindow from './InfoWindow';

export default function Marker({ post }: { post: Post }) {
    const [showDetail, setShowDetail] = useState<boolean>(false);

    function handleMarkerClick() {
        setShowDetail(true);
    }

    function handleInfoWindowCloseClick() {
        setShowDetail(false);
    }

    if (post.latitude === undefined || post.longitude === undefined) {
        return <></>;
    }

    if (showDetail) {
        return (
            <InfoWindow post={post} onCloseClick={handleInfoWindowCloseClick} />
        );
    } else {
        return <MarkerF visible={!showDetail} position={new google.maps.LatLng(post.latitude, post.longitude)} onClick={handleMarkerClick} />;
    }
}
