import { ApiClient } from "../api-client";
import type { SessionWithExercises } from "./session-types";

export const addExerciseToSession = async (
  baseUrl: string,
  sessionId: number,
  exerciseId: string
) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.post<SessionWithExercises>(
    `/sessions/${sessionId}/exercises/${exerciseId}`,
    {}
  );

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  return result;
};
