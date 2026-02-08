import { useQuery } from "@tanstack/react-query";
import type { SessionWithExercises } from "../api";
import { fetchSessionById, sessionsQueryKeys } from "../api";

export function useSessionQuery(
  baseUrl: string,
  sessionId: number,
  options?: { initialData?: SessionWithExercises; refetchOnMount?: boolean }
) {
  return useQuery({
    queryKey: sessionsQueryKeys.byId(sessionId),
    queryFn: () => fetchSessionById(baseUrl, sessionId),
    initialData: options?.initialData,
    refetchOnMount: options?.refetchOnMount ?? true,
  });
}
