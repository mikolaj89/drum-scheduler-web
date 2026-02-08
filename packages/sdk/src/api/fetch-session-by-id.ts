import { ApiClient } from "../api-client";
import type { SessionWithExercises } from "./session-types";

export const fetchSessionById = async (baseUrl: string, sessionId: number) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.get<SessionWithExercises>(
    `/sessions/${sessionId}`
  );

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  if (result.data == null) {
    throw new Error("Empty response");
  }

  return result.data;
};
