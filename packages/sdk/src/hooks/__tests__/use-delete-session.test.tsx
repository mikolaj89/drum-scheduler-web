import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  baseUrl,
  createTestQueryClient,
  createWrapper,
  sessionsQueryKeys,
} from "./test-utils";

const deleteSession = vi.fn().mockResolvedValue(null);

vi.mock("../../api", () => ({
  deleteSession,
  sessionsQueryKeys,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useDeleteSession", () => {
  it("deletes session and invalidates sessions query", async () => {
    const { useDeleteSession } = await import("../use-delete-session");
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(() => useDeleteSession(baseUrl), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(4);
    });

    expect(deleteSession).toHaveBeenCalledWith(baseUrl, 4);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: sessionsQueryKeys.all,
    });
  });
});
