import { DetailPost, DetailPlace, Post, PostListParams, SubmitPost, GlobalPosition } from "../types/post";
import { authAxios } from "./axios";

export class PostAPI {
  static async fetchPostList(params: PostListParams): Promise<Post[]> {
    const response = await authAxios.get("posts/", {
      params: params,
      paramsSerializer: { indexes: null },
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

  static async fetchHotPost(params: GlobalPosition): Promise<DetailPost | undefined> {
    const response = await authAxios.get(`posts/hot_one/`, {
      params: params,
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
    if (response.status === 204) return undefined;
    return response?.data;
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
    ).catch(() => { });
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
    ).catch(() => { });
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
    ).catch(() => { });
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
    ).catch(() => { });
  }

  static async fetchPlaceInfo(params: {lat: number; lng: number;}): Promise<DetailPlace[]> {
    const response = await authAxios.get(`posts/place/`, {
      params: params,
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
    return response.data;
  }
}
