import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  baseUrl,
  categoriesQueryKeys,
  createTestQueryClient,
  createWrapper,
  mockExercises,
} from "./test-utils";

const fetchCategoryExercises = vi.fn().mockResolvedValue(mockExercises);

vi.mock("../../api", () => ({
  fetchCategoryExercises,
  categoriesQueryKeys,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useCategoryExercisesQuery", () => {
  it("returns category exercises", async () => {
    const { useCategoryExercisesQuery } = await import(
      "../use-category-exercises-query"
    );
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(
      () => useCategoryExercisesQuery(baseUrl, "cat-1"),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockExercises);
    });

    expect(fetchCategoryExercises).toHaveBeenCalledWith(baseUrl, "cat-1");
  });
});
