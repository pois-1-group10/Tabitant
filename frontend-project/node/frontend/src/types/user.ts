export type User = {
    id: number;
    email: string;
    username: string;
    image: string;
}

export type PostUser = {
    email?: string;
    username?: string;
    password?: string;
}

export type DetailUser = {
    id: number;
    email: string;
    username: string;
    image: string;
    user_profile_id: number;
    follower_num: number;
    followee_num: number;
    like_num: number;
    default_post_id?: number;
    award_ids?: number[];
};

export type UserProfile = {
    id: number;
    user_id: number;
    bio: string;
    default_post_id: number;
};

export type PostUserProfile = {
    bio?: string;
    default_post_id?: number;
};
