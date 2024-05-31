import { Award } from "./award";
import { DetailPost } from "./post";

export type User = {
	id: number;
	email: string;
	username: string;
	image: string;
	followed?: boolean;
}

export type PostUser = {
	email?: string;
	username?: string;
	password?: string;
}

export type UserProfile = {
	id: number;
	user_id: number;
	bio: string;
	default_post: DetailPost;
};

export type DetailUser = {
	id: number;
	email: string;
	username: string;
	image: string;
	userprofile?: UserProfile;
	follower_num: number;
	followee_num: number;
	like_num: number;
	default_post_id?: number;
	award_ids?: number[];
	followed?: boolean;
	awards: Award[];
};

export type PostUserProfile = {
	bio?: string;
	default_post: number | null;
};

export type UserListParams = {
	following?: number;
	followed_by?: number;
}
