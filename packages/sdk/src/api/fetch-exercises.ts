import { Exercise } from "@drum-scheduler/contracts";
import { ApiClient } from "../api-client";

export const fetchExercises = async (baseUrl: string, queryString = "") => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.get<Exercise[]>(`/exercises${queryString}`);

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  return result.data;
};
