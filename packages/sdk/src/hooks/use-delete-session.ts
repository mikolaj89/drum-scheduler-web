import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSession, sessionsQueryKeys } from "../api";

export function useDeleteSession(baseUrl: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) => deleteSession(baseUrl, sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionsQueryKeys.all,
      });
    },
  });
}
