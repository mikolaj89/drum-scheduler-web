import { Exercise } from "@drum-scheduler/contracts";
import { ApiClient } from "../api-client";

export const fetchExercise = async (baseUrl: string, exerciseId: number) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.get<Exercise>(`/exercises/${exerciseId}`);

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  return result.data;
};
