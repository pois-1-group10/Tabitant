import { DetailUser, User, UserListParams } from "../types/user";
import { authAxios } from "./axios";

export class UserAPI {
  static async fetchAuthUser(): Promise<User> {
    const response = await authAxios.get("users/auth/", {
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
    return response.data;
  }

  static async fetchUserList(params: UserListParams): Promise<User[]> {
    const response = await authAxios.get("users/", {
      params: params,
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
    return response.data;
  }

  static async fetchUserDetail(id: number): Promise<DetailUser> {
    const response = await authAxios.get(`users/${id}/`, {
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
    return response.data;
  }

	static async follow(id: number): Promise<void> {
		await authAxios.post(`users/${id}/follow/`, {}, {
			headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
		})
	}

	static async unfollow(id: number): Promise<void> {
		await authAxios.post(`users/${id}/unfollow/`, {}, {
			headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
		})
	}
}
