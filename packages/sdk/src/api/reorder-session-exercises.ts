import { ApiClient } from "../api-client";
import type { SessionExercisesOrderInput } from "./session-types";

export const reorderSessionExercises = async (
  baseUrl: string,
  sessionId: number,
  exercises: SessionExercisesOrderInput
) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.patch<null>(
    `/sessions/${sessionId}/exercises-order`,
    exercises
  );

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  return result.data;
};
