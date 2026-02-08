import { Exercise, ExerciseInsert } from "@drum-scheduler/contracts";
import { ApiClient } from "../api-client";

export const createExercise = async (baseUrl: string, data: ExerciseInsert) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.post<Exercise>("/exercises", data);

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  return result;
};
