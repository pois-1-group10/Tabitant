import React, { createContext, useState } from "react";
import { useSearchParams } from "react-router-dom";

type MapLocationContextType = {
  center: {
    lat?: number;
    lng?: number;
  };
  zoom: number;
  setCenter: (lat?: number, lng?: number) => void;
  setZoom: (zoom: number) => void;
  setCurrentLocation: () => void;
};

export const MapLocationContext = createContext({} as MapLocationContextType);

export const MapLocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchParams] = useSearchParams();

  let queryLat: number | undefined = searchParams.has("lat") ? Number(searchParams.get("lat")) : undefined;
  let queryLng: number | undefined = searchParams.has("lng") ? Number(searchParams.get("lng")) : undefined;
  let queryZoom: number | undefined = searchParams.has("zoom") ? Number(searchParams.get("zoom")) : undefined;
  if (!queryLat || !queryLng) {
    queryLat = queryLng = undefined;
  }

  const [lat, setLat] = useState<number | undefined>(queryLat);
  const [lng, setLng] = useState<number | undefined>(queryLng);
  const [zoom, setZoom] = useState(queryZoom ?? 16);

  const setCenter = (lat?: number, lng?: number) => {
    if (lat === undefined || lng === undefined) return;
    setLat(lat);
    setLng(lng);
  };

  const setCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCenter(latitude, longitude);
      },
      (error) => {
      }
    );
  };

  return (
    <MapLocationContext.Provider value={{
      center: { lat: lat, lng: lng },
      zoom: zoom,
      setCenter: setCenter,
      setZoom: setZoom,
      setCurrentLocation: setCurrentLocation,
    }}>
      {children}
    </MapLocationContext.Provider>
  );
};
