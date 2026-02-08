import { useAddExerciseToSession as useAddExerciseToSessionSDK, useCategoryExercisesQuery as useCategoryExercisesQuerySDK } from "@drum-scheduler/sdk";

export const useAddExerciseToSession = (
  sessionId: number,
  exerciseId: string,
  onSuccess: (id: number) => void
) => {
  const API_BASE_URL = "http://localhost:8000";
  const mutation = useAddExerciseToSessionSDK(API_BASE_URL, sessionId);
  
  return {
    ...mutation,
    mutate: () => {
      if (!sessionId || !exerciseId) {
        throw new Error("Both sessionId and exerciseId are required.");
      }
      mutation.mutate(exerciseId, {
        onSuccess: () => onSuccess(sessionId),
      });
    },
  };
};

export const useCategoryExercisesQuery = (categoryId: string) => {
  const API_BASE_URL = "http://localhost:8000";
  return useCategoryExercisesQuerySDK(
    API_BASE_URL,
    categoryId,
    { enabled: !!categoryId }
  );
};
