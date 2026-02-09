import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  baseUrl,
  createTestQueryClient,
  createWrapper,
  sessionsQueryKeys,
} from "./test-utils";

const removeExerciseFromSession = vi.fn().mockResolvedValue(null);

vi.mock("../../api", () => ({
  removeExerciseFromSession,
  sessionsQueryKeys,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useRemoveExerciseFromSession", () => {
  it("removes exercise and invalidates session query", async () => {
    const { useRemoveExerciseFromSession } = await import(
      "../use-remove-exercise-from-session"
    );
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(
      () => useRemoveExerciseFromSession(baseUrl, 11),
      { wrapper }
    );

    await act(async () => {
      await result.current.mutateAsync(3);
    });

    expect(removeExerciseFromSession).toHaveBeenCalledWith(baseUrl, 11, 3);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: sessionsQueryKeys.byId(11),
    });
  });
});
