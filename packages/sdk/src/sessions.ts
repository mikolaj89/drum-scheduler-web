import { useQuery } from "@tanstack/react-query";
import {
  Exercise,
  Session
} from "@drum-scheduler/contracts";
import { ApiClient } from "./api-client.js";

export const sessionsQueryKeys = {
  all: ["sessions"] as const,
  byId: (sessionId: number) => ["sessions", sessionId] as const,
};

export type SessionWithExercises = Session & {
  totalDuration: number;
  exercises: Exercise[];
};

export const fetchSessions = async (baseUrl: string) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.get<Session[]>("/sessions");

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  // In case the server returns an empty body for a GET, keep a stable shape.
  return result.data ?? [];
};

export const fetchSessionById = async (baseUrl: string, sessionId: number) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.get<SessionWithExercises>(`/sessions/${sessionId}`);
  
  if ("error" in result) {
    throw new Error(result.error.message);
  }

  if (result.data == null) {
    throw new Error("Empty response");
  }

  return result.data;
};



export function useSessionsQuery(baseUrl: string) { 
  const result = useQuery({
    queryKey: sessionsQueryKeys.all,
    queryFn: () => fetchSessions(baseUrl),
  });

  return result;
}

export function useSessionQuery(baseUrl: string, sessionId: number) {
  const result = useQuery({
    queryKey: sessionsQueryKeys.byId(sessionId),
    queryFn: () => fetchSessionById(baseUrl, sessionId),
  });

  return result;
}
