import React, { createContext, useState } from "react";
import { Post } from "../types/post";

type PostListContextType = {
    posts: Post[];
    loading: boolean;
    fetchPosts: (params: {}) => Promise<void>;
}

export const PostListContext = createContext({} as PostListContextType);

const samplePosts: Post[] = [
	{
		id: 1,
		content_1: "あ",
		content_2: "い",
		content_3: "う",
		content_4: "え",
		content_5: "お",
		created_at: new Date(2022, 3, 9),
	},
	{
		id: 2,
		content_1: "か",
		content_2: "き",
		content_3: "く",
		content_4: "け",
		content_5: "こ",
		created_at: new Date(2022, 8, 9),
	},
	{
		id: 3,
		content_1: "さ",
		content_2: "し",
		content_3: "す",
		content_4: "せ",
		content_5: "そ",
		created_at: new Date(2022, 11, 9),
	},
	{
		id: 4,
		content_1: "た",
		content_2: "ち",
		content_3: "つ",
		content_4: "て",
		content_5: "と",
		created_at: new Date(2023, 3, 9),
	},
	{
		id: 5,
		content_1: "な",
		content_2: "に",
		content_3: "ぬ",
		content_4: "ね",
		content_5: "の",
		created_at: new Date(2023, 5, 9),
	},
	{
		id: 6,
		content_1: "ははははは",
		content_2: "ひひひひひひひ",
		content_3: "ふふふふふ",
		content_4: "へへへへへ",
		content_5: "ほほっほほほほ",
		created_at: new Date(2023, 10, 9),
	},
];

export const PostListProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPosts = async () => {
		setPosts(samplePosts);
	};

	return (
    <PostListContext.Provider value={{posts, loading, fetchPosts}} >
			{ children }
		</PostListContext.Provider>
  )
};
