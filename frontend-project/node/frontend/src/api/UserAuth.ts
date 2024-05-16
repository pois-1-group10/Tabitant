import { authAxios } from "./axios";
import {
  LoginData,
  PasswordChangeInputs,
  PasswordResetConfirmInputs,
  SignupData,
} from "../types/auth";

export class UserAuthAPI {
  static async login(params: LoginData): Promise<{ key: string }> {
    const response = await authAxios.post("dj-rest-auth/login/", params, {
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
    return response.data;
  }

  static async signup(data: SignupData): Promise<void> {
    await authAxios.post("dj-rest-auth/registration/", data, {
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
  }

  static async logout(): Promise<void> {
    await authAxios.post("dj-rest-auth/logout/");
  }

  static async resetPassword(email: string): Promise<void> {
    await authAxios.post("dj-rest-auth/password/reset/", { email });
  }

  static async resetResetConfirm(
    data: PasswordResetConfirmInputs
  ): Promise<void> {
    await authAxios.post("dj-rest-auth/password/reset/confirm/", data);
  }

  static async changePassword(data: PasswordChangeInputs): Promise<void> {
    await authAxios.post("dj-rest-auth/password/change/", data, {
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
  }
}
