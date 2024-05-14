import { DetailUser, User, UserListParams } from "../types/user";
import { authAxios } from "./axios";

export class UserAPI {
  static async fetchUserList(params: UserListParams): Promise<User[]> {
    const response = await authAxios.get(
			"users/",
			{ params: params }
		);
		return response.data;
  };

	static async fetchUserDetail(id: number): Promise<DetailUser> {
		const response = await authAxios.get(
			`users/${id}/`,
		);
		return response.data;
	}
}
