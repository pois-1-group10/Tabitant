import React, { createContext, useState } from "react";
import { DetailPost } from "../types/post";
import { PostAPI } from "../api/Post";
import { useParams } from "react-router-dom";

type PostDetailContextType = {
  post?: DetailPost;
  loading: boolean;
  fetchPostDetail: (id?: number) => Promise<void>;
  fetchHotPost: () => void;
};

export const PostDetailContext = createContext({} as PostDetailContextType);

export const PostDetailProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [post, setPost] = useState<DetailPost | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();
  const userId = Number(params.id);

  const fetchPostDetail = async (id?: number) => {
    setLoading(true);
    try {
      const postData = await PostAPI.fetchPostDetail(id ?? userId);
      setPost(postData);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const fetchHotPost = () =>
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Google Maps Geocoding APIを使用して緯度経度から住所を取得
        setLoading(true);
        try {
          const postData = await PostAPI.fetchHotPost({ lat: latitude, lng: longitude });
          setPost(postData);
        } catch (e) {
          console.log(e);
        }
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );

  return (
    <PostDetailContext.Provider
      value={{ post, loading, fetchPostDetail, fetchHotPost }}
    >
      {children}
    </PostDetailContext.Provider>
  );
};
