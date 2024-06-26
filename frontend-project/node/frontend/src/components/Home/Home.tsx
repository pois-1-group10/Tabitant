/** @jsxImportSource @emotion/react */

import { useJsApiLoader } from '@react-google-maps/api';
import Map from './Map'
import SearchBox from './SearchBox';
import FeaturedPost from './FeaturedPost';
import NavigationMenu from '../common/NavigationMenu';

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
            <Map />
            <SearchBox />
            <FeaturedPost />
            <NavigationMenu post ranking profile logout login />
        </>
    );
}