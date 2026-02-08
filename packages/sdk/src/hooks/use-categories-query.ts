import { useQuery } from "@tanstack/react-query";
import { categoriesQueryKeys, fetchCategories } from "../api";

export function useCategoriesQuery(baseUrl: string) {
  return useQuery({
    queryKey: categoriesQueryKeys.all,
    queryFn: () => fetchCategories(baseUrl),
  });
}
