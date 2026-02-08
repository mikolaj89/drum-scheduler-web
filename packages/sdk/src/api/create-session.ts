import { ApiClient } from "../api-client";
import type { CreateSessionResponse } from "./session-types";

export const createSession = async <
  T extends { name: string; notes: string | null }
>(
  baseUrl: string,
  session: T
) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.post<CreateSessionResponse>(
    "/sessions",
    session
  );

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  return result;
};
