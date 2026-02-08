import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession, sessionsQueryKeys } from "../api";
import { SessionInsert } from "@drum-scheduler/contracts";

export function useCreateSession(
  baseUrl: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (session: SessionInsert) => createSession(baseUrl, session),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionsQueryKeys.all,
      });
    },
  });
}
