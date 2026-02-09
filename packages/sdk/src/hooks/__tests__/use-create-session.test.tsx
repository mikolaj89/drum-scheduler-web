import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  baseUrl,
  createTestQueryClient,
  createWrapper,
  mockSessionInsert,
  sessionsQueryKeys,
} from "./test-utils";

const createSession = vi.fn().mockResolvedValue({ data: { id: 1 } });

vi.mock("../../api", () => ({
  createSession,
  sessionsQueryKeys,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useCreateSession", () => {
  it("creates session and invalidates sessions query", async () => {
    const { useCreateSession } = await import("../use-create-session");
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(() => useCreateSession(baseUrl), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(mockSessionInsert);
    });

    expect(createSession).toHaveBeenCalledWith(baseUrl, mockSessionInsert);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: sessionsQueryKeys.all,
    });
  });
});
