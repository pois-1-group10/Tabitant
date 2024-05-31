import { Comment, CommentListParams, PostCommentData } from "../types/comment";
import { authAxios } from "./axios";

export class CommentAPI {
  static async fetchCommentList(params: CommentListParams): Promise<Comment[]> {
    const response = await authAxios.get("comments/", {
      params: params,
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
    return response.data;
  }

  static async createComment(data: PostCommentData): Promise<void> {
    const response = await authAxios.post("comments/", data, {
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
    return response.data;
  }

  static async like(id: number): Promise<void> {
    await authAxios.post(`comments/${id}/like/`, {}, {
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
  }

  static async unlike(id: number): Promise<void> {
    await authAxios.post(`comments/${id}/unlike/`, {}, {
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
  }

  static async dislike(id: number): Promise<void> {
    await authAxios.post(`comments/${id}/dislike/`, {}, {
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
  }

  static async undislike(id: number): Promise<void> {
    await authAxios.post(`comments/${id}/undislike/`, {}, {
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
  }
}
