import { useQuery } from "@tanstack/react-query";
import { categoriesQueryKeys, fetchCategoryExercises } from "../api";

export function useCategoryExercisesQuery(
  baseUrl: string,
  categoryId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: categoriesQueryKeys.exercises(categoryId),
    queryFn: () => fetchCategoryExercises(baseUrl, categoryId),
    enabled: options?.enabled ?? !!categoryId,
    retry: false,
  });
}
