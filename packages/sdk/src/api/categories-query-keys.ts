export const categoriesQueryKeys = {
  all: ["categories"] as const,
  byId: (categoryId: string) => ["categories", categoryId] as const,
  exercises: (categoryId: string) =>
    ["categories", categoryId, "exercises"] as const,
};
