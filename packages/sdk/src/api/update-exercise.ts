import { Exercise } from "@drum-scheduler/contracts";
import { ApiClient } from "../api-client";

export const updateExercise = async <T extends Record<string, any>>(
  baseUrl: string,
  exerciseId: number,
  data: T
) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.put<Exercise>(`/exercises/${exerciseId}`, data);

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  return result;
};
