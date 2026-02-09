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

const updateExercise = vi.fn().mockResolvedValue({ data: mockExercise });

vi.mock("../../api", () => ({
  updateExercise,
  exercisesQueryKeys,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useUpdateExercise", () => {
  it("updates exercise and invalidates queries", async () => {
    const { useUpdateExercise } = await import("../use-update-exercise");
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(() => useUpdateExercise(baseUrl, 7), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(mockExerciseInsert);
    });

    expect(updateExercise).toHaveBeenCalledWith(baseUrl, 7, mockExerciseInsert);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: exercisesQueryKeys.byId(7),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: exercisesQueryKeys.all,
    });
  });
});
