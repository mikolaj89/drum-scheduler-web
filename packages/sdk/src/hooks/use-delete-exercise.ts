import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExercise, exercisesQueryKeys } from "../api";

export function useDeleteExercise(baseUrl: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exerciseId: number) => deleteExercise(baseUrl, exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: exercisesQueryKeys.all,
      });
    },
  });
}
