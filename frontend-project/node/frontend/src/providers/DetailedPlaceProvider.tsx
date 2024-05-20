import React, { createContext, useEffect, useState } from "react";
import { DetailPlace } from "../types/post";
import { PostAPI } from "../api/Post";

type DetailedPlaceContextType = {
  places: DetailPlace[];
  loading: boolean;
	lat?: number | null;
	lng?: number | null;
  setLat: React.Dispatch<React.SetStateAction<number|null|undefined>>;
  setLng: React.Dispatch<React.SetStateAction<number|null|undefined>>;
  fetchPlaceInfo: (id?: number) => Promise<void>;
};

export const DetailedPlaceContext = createContext(
  {} as DetailedPlaceContextType
);

export const DetailedPlaceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lat, setLat] = useState<number | null | undefined>();
  const [lng, setLng] = useState<number | null | undefined>();
  const [places, setPlaces] = useState<DetailPlace[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPlaceInfo = async (id?: number) => {
    if (lat !== undefined && lng !== undefined) {
      setLoading(true);
      try {
        const placeData = await PostAPI.fetchPlaceInfo({
          lat: lat ?? 0,
          lng: lng ?? 0,
        });
        setPlaces(placeData);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
  };

	useEffect(() => {
		fetchPlaceInfo();
	}, [lat, lng]);

	return (
		<DetailedPlaceContext.Provider
			value={{ places, loading, lat, lng, setLat, setLng, fetchPlaceInfo }}
		>
			{children}
		</DetailedPlaceContext.Provider>
	);
};
