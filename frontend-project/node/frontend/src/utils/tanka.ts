import axios from "axios";
import { Post } from "../types/post";

export const postContentArray = (post: Post): string[] => {
  return [
    post.content_1,
    post.content_2,
    post.content_3,
    post.content_4,
    post.content_5,
  ]
}

export const tankaFromPost = (post: Post): string => {
  return postContentArray(post).join(" ");
};

export const convertToHiragana = async (text: string) => {
  if (text.length === 0) return "";

  const response = await axios({
    method: "post",
    url: "https://labs.goo.ne.jp/api/hiragana",
    headers: {
      "Content-Type": `application/json`,
    },
    data: {
      app_id: process.env.REACT_APP_GOO_API_KEY,
      sentence: text,
      output_type: "hiragana",
    },
  });

  return response.data.converted.replace(" ", "");
}
