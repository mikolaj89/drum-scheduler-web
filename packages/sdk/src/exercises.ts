import { useQuery } from "@tanstack/react-query";
import { GetExercisesResponseSchema } from "@drum-scheduler/contracts";
import { DrumSchedulerSdkConfig, requestJson } from "./http.js";

export const exercisesQueryKeys = {
  all: (params: { name?: string | null; categoryId?: string | null } = {}) =>
    ["exercises", params] as const,
};

export async function getExercises(
  config: DrumSchedulerSdkConfig,
  params: { name?: string | null; categoryId?: string | null }
) {
  const search = new URLSearchParams();
  if (params.name) search.set("name", params.name);
  if (params.categoryId) search.set("categoryId", params.categoryId);
  const query = search.toString();

  return requestJson(
    config,
    `/exercises${query ? `?${query}` : ""}`,
    { method: "GET" },
    GetExercisesResponseSchema
  );
}

export function useExercisesQuery(
  config: DrumSchedulerSdkConfig,
  params: { name?: string | null; categoryId?: string | null } = {}
) {
  return useQuery({
    queryKey: exercisesQueryKeys.all(params),
    queryFn: () => getExercises(config, params),
  });
}
