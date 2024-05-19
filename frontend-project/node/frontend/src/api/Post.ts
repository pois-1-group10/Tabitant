import { DetailPost, Post, PostListParams, SubmitPost } from "../types/post";
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

  static async fetchHotPost(): Promise<DetailPost> {
    const response = await authAxios.get(`posts/hot_one/`, {
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
    return response.data;
  }

  static async createPost(data: SubmitPost): Promise<DetailPost> {
    const response = await authAxios.post(`posts/`, data, {
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
    return response.data;
  }

  static async like(id: number): Promise<void> {
    await authAxios.post(
      `posts/${id}/like/`,
      {},
      {
        headers: sessionStorage.getItem("token")
          ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
          : {},
      }
    );
  }

  static async unlike(id: number): Promise<void> {
    await authAxios.post(
      `posts/${id}/unlike/`,
      {},
      {
        headers: sessionStorage.getItem("token")
          ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
          : {},
      }
    );
  }

  static async dislike(id: number): Promise<void> {
    await authAxios.post(
      `posts/${id}/dislike/`,
      {},
      {
        headers: sessionStorage.getItem("token")
          ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
          : {},
      }
    );
  }

  static async undislike(id: number): Promise<void> {
    await authAxios.post(
      `posts/${id}/undislike/`,
      {},
      {
        headers: sessionStorage.getItem("token")
          ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
          : {},
      }
    );
  }
}
