import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Exercise } from "@drum-scheduler/contracts";
import { reorderSessionExercises, sessionsQueryKeys } from "../api";

export function useReorderSessionExercises(
  baseUrl: string,
  sessionId: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exercises: Exercise[]) =>
      reorderSessionExercises(baseUrl, sessionId, { exercises }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionsQueryKeys.byId(sessionId),
      });
    },
  });
}
