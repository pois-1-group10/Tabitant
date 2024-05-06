/** @jsxImportSource @emotion/react */

import { useJsApiLoader } from '@react-google-maps/api';
import Map from './Map'
import SearchBox from './SearchBox';
import FeaturedPost from './FeaturedPost';
import NavigationMenu from './NavigationMenu';

export default function App() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_API_KEY || ""
    });

    if (!isLoaded) {
        return <></>;
    }

    return (
        <>
            <Map lat={35.026244} lng={135.780822} />
            <SearchBox />
            <FeaturedPost />
            <NavigationMenu />
        </>
    );
}