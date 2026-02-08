export const exercisesQueryKeys = {
  all: ["exercises"] as const,
  byId: (exerciseId: number) => ["exercises", exerciseId] as const,
  filtered: (filters: { name: string | null; categoryId: string | null }) =>
    ["exercises", filters.name, filters.categoryId] as const,
};
