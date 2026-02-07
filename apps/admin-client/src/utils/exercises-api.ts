import { fetchData } from "./request";
import type { Category, Exercise } from "@drum-scheduler/contracts";
import { ExerciseSubmitData } from "@/components/Exercise/ExerciseForm/exercise-form-helper";
import { ApiClient } from "./api-client";
import { ApiClient as ApiClientV2 } from "@drum-scheduler/sdk";

// this function have more logic - therefore maybe should be included in dedicated hook instead 🤷
export const fetchCategories = async () => {
  const apiClient = new ApiClientV2("http://localhost:8000");
  const result = await apiClient.get<Category[]>("/categories");
  if ("error" in result) {
    throw new Error(result.error.message);
  }
  return result.data;
};

export const fetchCategoryExercises = async (id: string) => {
  const apiClient = new ApiClientV2("http://localhost:8000");
  return await apiClient.get<Exercise[]>(`/categories/${id}/exercises`);
};

export const fetchExercise = async (id: number) =>
  await fetchData<Exercise>(`/exercises/${id}`);

export const fetchExercises = async ({
  name,
  categoryId,
}: {
  name: string | null;
  categoryId: string | null;
}) => {
  const params = new URLSearchParams();
  if (name) {
    params.set("name", name);
  }
  if (categoryId) {
    params.set("categoryId", categoryId);
  }
  const paramsString = `?${params.toString()}`;
  return await fetchData<Exercise[]>(`/exercises${paramsString}`);
};

export const createExercise = async (data: ExerciseSubmitData) => {
  const apiClient = new ApiClient("http://localhost:8000");
  return apiClient.post<Exercise>("/exercises", data);
};

export const deleteExercise = async (id: number) => {
  const apiClient = new ApiClient("http://localhost:8000");
  return apiClient.delete<Exercise>(`/exercises/${id}`);
};

export const editExercise = async (data: ExerciseSubmitData, id: number) => {
  const apiClient = new ApiClient("http://localhost:8000");
  return apiClient.put<Exercise>(`/exercises/${id}`, data);
};
