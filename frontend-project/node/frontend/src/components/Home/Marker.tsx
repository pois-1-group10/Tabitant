import React, { useCallback, useEffect, useState } from 'react'
import { MarkerF, InfoWindowF } from '@react-google-maps/api';
import { css } from '@emotion/react'
import { Post, User, Tanka } from '../../models';

export default function Marker({ post }: { post: Post }) {
    const [showDetail, setShowDetail] = useState<boolean>(false);

    function handleMarkerClick() {
        setShowDetail(true);
    }

    function handleInfoWindowCloseClick() {
        setShowDetail(false);
    }

    if (showDetail) {
        return (
            <InfoWindowF position={post.location} onCloseClick={handleInfoWindowCloseClick}>
                <div>
                    {post.content.toString()}
                </div>
            </InfoWindowF>
        );
    } else {
        return <MarkerF visible={!showDetail} position={post.location} onClick={handleMarkerClick} />;
    }
}
