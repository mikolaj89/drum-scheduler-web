import { Session, SessionInsert } from "@drum-scheduler/contracts";
import { ApiClient } from "../api-client";
import type { CreateSessionResponse } from "./session-types";

export const createSession = async (
  baseUrl: string,
  session: SessionInsert
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
