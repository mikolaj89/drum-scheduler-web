import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  baseUrl,
  createTestQueryClient,
  createWrapper,
  exercisesQueryKeys,
  mockExercise,
} from "./test-utils";

const fetchExercise = vi.fn().mockResolvedValue(mockExercise);

vi.mock("../../api", () => ({
  fetchExercise,
  exercisesQueryKeys,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useExerciseQuery", () => {
  it("returns exercise data", async () => {
    const { useExerciseQuery } = await import("../use-exercise-query");
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(() => useExerciseQuery(baseUrl, 1), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockExercise);
    });

    expect(fetchExercise).toHaveBeenCalledWith(baseUrl, 1);
  });
});
