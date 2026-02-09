import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  baseUrl,
  createTestQueryClient,
  createWrapper,
  sessionsQueryKeys,
} from "./test-utils";

const addExerciseToSession = vi.fn().mockResolvedValue({ data: {} });

vi.mock("../../api", () => ({
  addExerciseToSession,
  sessionsQueryKeys,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useAddExerciseToSession", () => {
  it("adds exercise and invalidates session query", async () => {
    const { useAddExerciseToSession } = await import(
      "../use-add-exercise-to-session"
    );
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(() => useAddExerciseToSession(baseUrl, 12), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync("ex-1");
    });

    expect(addExerciseToSession).toHaveBeenCalledWith(baseUrl, 12, "ex-1");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: sessionsQueryKeys.byId(12),
    });
  });
});
