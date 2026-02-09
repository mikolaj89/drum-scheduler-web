import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  baseUrl,
  createTestQueryClient,
  createWrapper,
  exercisesQueryKeys,
} from "./test-utils";

const deleteExercise = vi.fn().mockResolvedValue(null);

vi.mock("../../api", () => ({
  deleteExercise,
  exercisesQueryKeys,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useDeleteExercise", () => {
  it("deletes exercise and invalidates queries", async () => {
    const { useDeleteExercise } = await import("../use-delete-exercise");
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(() => useDeleteExercise(baseUrl), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(5);
    });

    expect(deleteExercise).toHaveBeenCalledWith(baseUrl, 5);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: exercisesQueryKeys.all,
    });
  });
});
