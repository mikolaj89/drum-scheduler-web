import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeExerciseFromSession, sessionsQueryKeys } from "../api";

export function useRemoveExerciseFromSession(
  baseUrl: string,
  sessionId: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exerciseId: number) =>
      removeExerciseFromSession(baseUrl, sessionId, exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionsQueryKeys.byId(sessionId),
      });
    },
  });
}
