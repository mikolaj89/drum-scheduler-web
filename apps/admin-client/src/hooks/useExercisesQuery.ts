import { useQuery } from "@tanstack/react-query";
import type { Exercise } from "@drum-scheduler/contracts";
import { fetchExercises } from "@drum-scheduler/sdk";
import { buildExercisesQueryParams } from "@/utils/query-params";

type ExercisesFilters = {
  name?: string | null;
  categoryId?: string | null;
};

type UseExercisesQueryOptions = {
  refetchOnMount?: boolean;
  initialData?: Exercise[] | null;
};

const normalizeFilters = (filters: ExercisesFilters) => ({
  name: filters.name?.trim() ? filters.name : null,
  categoryId: filters.categoryId?.trim() ? filters.categoryId : null,
});

export const useExercisesQuery = (
  baseUrl: string,
  filters: ExercisesFilters,
  options?: UseExercisesQueryOptions
) => {
  const normalizedFilters = normalizeFilters(filters);
  const queryString = buildExercisesQueryParams(normalizedFilters);

  return useQuery({
    queryKey: ["exercises", queryString],
    queryFn: () => fetchExercises(baseUrl, queryString),
    refetchOnMount: options?.initialData ? false : options?.refetchOnMount ?? true,
    initialData: options?.initialData ?? undefined,
  });
};
