import { Category } from "@drum-scheduler/contracts";
import { ApiClient } from "../api-client";

export const fetchCategories = async (baseUrl: string) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.get<Category[]>("/categories");

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  return result.data;
};
