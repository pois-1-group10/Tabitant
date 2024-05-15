import { Comment, CommentListParams } from "../types/comment";
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
  };
}