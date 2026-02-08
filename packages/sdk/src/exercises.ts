import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Category, Exercise, ExerciseInsert } from "@drum-scheduler/contracts";
import { ApiClient } from "./api-client";

export const exercisesQueryKeys = {
  all: ["exercises"] as const,
  byId: (exerciseId: number) => ["exercises", exerciseId] as const,
  filtered: (filters: { name: string | null; categoryId: string | null }) => 
    ["exercises", filters.name, filters.categoryId] as const,
};

export const categoriesQueryKeys = {
  all: ["categories"] as const,
  byId: (categoryId: string) => ["categories", categoryId] as const,
  exercises: (categoryId: string) => ["categories", categoryId, "exercises"] as const,
};

// Categories
export const fetchCategories = async (baseUrl: string) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.get<Category[]>("/categories");
  
  if ("error" in result) {
    throw new Error(result.error.message);
  }
  
  return result.data;
};

export function useCategoriesQuery(baseUrl: string) {
  return useQuery({
    queryKey: categoriesQueryKeys.all,
    queryFn: () => fetchCategories(baseUrl),
  });
}

export const fetchCategoryExercises = async (
  baseUrl: string,
  categoryId: string
) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.get<Exercise[]>(`/categories/${categoryId}/exercises`);
  
  if ("error" in result) {
    throw new Error(result.error.message);
  }
  
  return result.data;
};

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

// Exercises
export const fetchExercise = async (
  baseUrl: string,
  exerciseId: number
) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.get<Exercise>(`/exercises/${exerciseId}`);
  
  if ("error" in result) {
    throw new Error(result.error.message);
  }
  
  return result.data;
};

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

export const fetchExercises = async (baseUrl: string, queryString = "") => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.get<Exercise[]>(`/exercises${queryString}`);
  
  if ("error" in result) {
    throw new Error(result.error.message);
  }
  
  return result.data;
};

export const createExercise = async (
  baseUrl: string,
  data: ExerciseInsert
) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.post<Exercise>("/exercises", data);
  
  if ("error" in result) {
    throw new Error(result.error.message);
  }
  
  return result;
};

export function useCreateExercise(baseUrl: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ExerciseInsert) => createExercise(baseUrl, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: exercisesQueryKeys.all,
      });
    },
  });
}

export const updateExercise = async <T extends Record<string, any>>(
  baseUrl: string,
  exerciseId: number,
  data: T
) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.put<Exercise>(`/exercises/${exerciseId}`, data);
  
  if ("error" in result) {
    throw new Error(result.error.message);
  }
  
  return result;
};

export function useUpdateExercise(
  baseUrl: string,
  exerciseId: number
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ExerciseInsert) => updateExercise(baseUrl, exerciseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: exercisesQueryKeys.byId(exerciseId),
      });
      queryClient.invalidateQueries({
        queryKey: exercisesQueryKeys.all,
      });
    },
  });
}

export const deleteExercise = async (
  baseUrl: string,
  exerciseId: number
) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.delete<Exercise>(`/exercises/${exerciseId}`);
  
  if ("error" in result) {
    throw new Error(result.error.message);
  }
  
  return result.data;
};

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
