import { useQuery } from "@tanstack/react-query";
import { exercisesQueryKeys, fetchExercise } from "../api";

export function useExerciseQuery(
  baseUrl: string,
  exerciseId: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: exercisesQueryKeys.byId(exerciseId),
    queryFn: () => fetchExercise(baseUrl, exerciseId),
    enabled: options?.enabled ?? !!exerciseId,
  });
}
