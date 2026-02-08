import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession, sessionsQueryKeys } from "../api";

export function useCreateSession<T extends { name: string; notes: string | null }>(
  baseUrl: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (session: T) => createSession(baseUrl, session),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionsQueryKeys.all,
      });
    },
  });
}
