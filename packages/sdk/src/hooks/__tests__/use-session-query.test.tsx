import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { baseUrl, createTestQueryClient, createWrapper, mockSession } from "./test-utils";

const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
  const url = typeof input === "string" ? input : input.toString();

  if (url.includes("/sessions/123")) {
    return {
      ok: true,
      json: async () => ({ data: mockSession }),
    } as Response;
  }

  return {
    ok: false,
    json: async () => ({ error: { message: "Not found", errorCode: "404" } }),
  } as Response;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("useSessionQuery", () => {
  it("returns mocked session data", async () => {
    vi.stubGlobal("fetch", fetchMock);
    const { useSessionQuery } = await import("../use-session-query");
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(
      () => useSessionQuery(baseUrl, 123),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockSession);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${baseUrl}/sessions/123`,
      expect.any(Object)
    );
  });

  it("returns error when api responds with error", async () => {
    vi.stubGlobal("fetch", fetchMock);
    const { useSessionQuery } = await import("../use-session-query");
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(
      () => useSessionQuery(baseUrl, 999),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe("Not found");
    expect(fetchMock).toHaveBeenCalledWith(
      `${baseUrl}/sessions/999`,
      expect.any(Object)
    );
  });
});
