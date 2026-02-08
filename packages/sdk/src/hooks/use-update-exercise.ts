import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExerciseInsert } from "@drum-scheduler/contracts";
import { exercisesQueryKeys, updateExercise } from "../api";

export function useUpdateExercise(baseUrl: string, exerciseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExerciseInsert) =>
      updateExercise(baseUrl, exerciseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: exercisesQueryKeys.byId(exerciseId),
      });
      queryClient.invalidateQueries({
        queryKey: exercisesQueryKeys.all,
      });
    },
  });
}
