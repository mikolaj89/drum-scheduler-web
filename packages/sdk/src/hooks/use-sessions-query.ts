import { useQuery } from "@tanstack/react-query";
import type { Session } from "@drum-scheduler/contracts";
import { fetchSessions, sessionsQueryKeys } from "../api";

export function useSessionsQuery(
  baseUrl: string,
  options?: { initialData?: Session[]; refetchOnMount?: boolean }
) {
  return useQuery({
    queryKey: sessionsQueryKeys.all,
    queryFn: () => fetchSessions(baseUrl),
    initialData: options?.initialData,
    refetchOnMount: options?.refetchOnMount ?? true,
  });
}
