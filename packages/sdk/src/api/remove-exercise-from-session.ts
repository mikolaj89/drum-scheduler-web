import { ApiClient } from "../api-client";

export const removeExerciseFromSession = async (
  baseUrl: string,
  sessionId: number,
  exerciseId: number
) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.delete<null>(
    `/sessions/${sessionId}/exercises/${exerciseId}`
  );

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  return result.data;
};
