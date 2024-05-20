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
  prefecture?: Prefecture;
  good_count?: number;
  bad_count?: number;
  comment_count?: number;
  liked: boolean;
  disliked: boolean;
  created_at: Date;
  tags: string[];
};

export type SubmitPost = {
  user?: number;
  content_1: string;
  content_2: string;
  content_3: string;
  content_4: string;
  content_5: string;
  hiragana_1: string;
  hiragana_2: string;
  hiragana_3: string;
  hiragana_4: string;
  hiragana_5: string;
  latitude?: number;
  longitude?: number;
  prefecture?: string | null;
  detailed_place?: string;
  tag_list?: string[];
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
  prefecture?: Prefecture;
  detailed_place?: string;
  emotion_ureshii: number;
  emotion_omoshiroi: number;
  emotion_odayaka: number;
  emotion_shimijimi: number;
  emotion_samishii: number;
  emotion_ikari: number;
  good_count?: number;
  bad_count?: number;
  comment_count?: number;
  tags: string[];
  liked: boolean;
  disliked: boolean;
  created_at: Date;
};

export type PostListParams = {
  lat?: number;
  lng?: number;
  search?: string;
  tag?: number[];
  emotion?: number[];
  user_id?: number;
  liked_by?: number;
  compe_id?: number;
  ranking?: boolean;
}

export type Prefecture = {
  id: number;
  name: string;
}

export type ChartData = {
  emotion: string;
  score: number;
  fullMark: number;
}

export type DetailPlace = {
  name: string;
  place_id: string;
}

export type GlobalPosition = {
  lat: number;
  lng: number;
}
