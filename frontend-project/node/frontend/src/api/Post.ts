import { DetailPost, Post, PostListParams } from "../types/post";
import { authAxios } from "./axios";

export class PostAPI {
  static async fetchPostList(params: PostListParams): Promise<Post[]> {
    const response = await authAxios.get("posts/", {
      params: params,
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
    return response.data;
  }

  static async fetchPostDetail(id: number): Promise<DetailPost> {
    const response = await authAxios.get(`posts/${id}/`, {
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
    return response.data;
  }
}
