import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExerciseInsert } from "@drum-scheduler/contracts";
import { createExercise, exercisesQueryKeys } from "../api";

export function useCreateExercise(baseUrl: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExerciseInsert) => createExercise(baseUrl, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: exercisesQueryKeys.all,
      });
    },
  });
}
