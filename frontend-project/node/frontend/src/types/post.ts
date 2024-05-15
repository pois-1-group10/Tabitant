import { User } from "./user";

export type Post = {
  id: number;
  user?: User;
  content_1: string;
  content_2: string;
  content_3: string;
  content_4: string;
  content_5: string;
  latitude?: number;
  longitude?: number;
  prefecture?: string;
  good_count?: number;
  bad_count?: number;
	created_at: Date;
};

export type SubmitPost = {
  user_id?: number;
  content_1: string;
  content_2: string;
  content_3: string;
  content_4: string;
  content_5: string;
  latitude?: number;
  longitude?: number;
  prefecture_id?: number;
  tags?: number[];
};

export type DetailPost = {
  id: number;
  user: User;
  content_1: string;
  content_2: string;
  content_3: string;
  content_4: string;
  content_5: string;
  latitude?: number;
  longitude?: number;
  prefecture?: string;
  detailed_place_id?: string;
  emotion_ureshii: number;
  emotion_omoshiroi: number;
  emotion_odayaka: number;
  emotion_shimijimi: number;
  emotion_samishii: number;
  emotion_ikari: number;
  good_count?: number;
  bad_count?: number;
  tags?: string;
  liked: boolean;
  disliked: boolean;
	created_at: Date;
};

export type PostListParams = {
  lat?: number;
  lng?: number;
  search?: string;
  tag?: string[];
  emotion?: string;
  user_id?: number;
  liked_by?: number;
  compe_id?: number;
}
