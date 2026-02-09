import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  baseUrl,
  createTestQueryClient,
  createWrapper,
  exercisesQueryKeys,
  mockExercise,
  mockExerciseInsert,
} from "./test-utils";

const createExercise = vi.fn().mockResolvedValue({ data: mockExercise });

vi.mock("../../api", () => ({
  createExercise,
  exercisesQueryKeys,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useCreateExercise", () => {
  it("creates exercise and invalidates queries", async () => {
    const { useCreateExercise } = await import("../use-create-exercise");
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(() => useCreateExercise(baseUrl), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(mockExerciseInsert);
    });

    expect(createExercise).toHaveBeenCalledWith(baseUrl, mockExerciseInsert);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: exercisesQueryKeys.all,
    });
  });
});
