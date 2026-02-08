import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addExerciseToSession, sessionsQueryKeys } from "../api";

export function useAddExerciseToSession(baseUrl: string, sessionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exerciseId: string) =>
      addExerciseToSession(baseUrl, sessionId, exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionsQueryKeys.byId(sessionId),
      });
    },
  });
}
