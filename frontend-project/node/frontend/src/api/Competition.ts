import { Competition, CompetitionListParams } from "../types/award";
import { authAxios } from "./axios";

export class CompetitionAPI {
  static async fetchCompetitionList(params: CompetitionListParams): Promise<Competition[]> {
    const response = await authAxios.get("competitions/", {
      params: params,
      headers: sessionStorage.getItem("token")
        ? { Authorization: `Token ${sessionStorage.getItem("token")}` }
        : {},
    });
    return response.data;
  }
}
