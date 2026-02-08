import { Exercise } from "@drum-scheduler/contracts";
import { ApiClient } from "../api-client";

export const fetchCategoryExercises = async (
  baseUrl: string,
  categoryId: string
) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.get<Exercise[]>(
    `/categories/${categoryId}/exercises`
  );

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  return result.data;
};
