import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  baseUrl,
  createTestQueryClient,
  createWrapper,
  mockExercises,
  sessionsQueryKeys,
} from "./test-utils";

const reorderSessionExercises = vi.fn().mockResolvedValue(null);

vi.mock("../../api", () => ({
  reorderSessionExercises,
  sessionsQueryKeys,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useReorderSessionExercises", () => {
  it("reorders exercises and invalidates session query", async () => {
    const { useReorderSessionExercises } = await import(
      "../use-reorder-session-exercises"
    );
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(() => useReorderSessionExercises(baseUrl, 10), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync(mockExercises);
    });

    expect(reorderSessionExercises).toHaveBeenCalledWith(baseUrl, 10, {
      exercises: mockExercises,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: sessionsQueryKeys.byId(10),
    });
  });
});
