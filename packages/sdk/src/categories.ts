import { useQuery } from "@tanstack/react-query";
import { GetCategoriesResponseSchema } from "@drum-scheduler/contracts";
import { DrumSchedulerSdkConfig, requestJson } from "./http.js";

export const categoriesQueryKeys = {
  all: ["categories"] as const,
};

export async function getCategories(config: DrumSchedulerSdkConfig) {
  return requestJson(config, "/categories", { method: "GET" }, GetCategoriesResponseSchema);
}

export function useCategoriesQuery(config: DrumSchedulerSdkConfig) {
  return useQuery({
    queryKey: categoriesQueryKeys.all,
    queryFn: () => getCategories(config),
  });
}
