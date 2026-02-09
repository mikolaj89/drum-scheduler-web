import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { baseUrl, categoriesQueryKeys, createTestQueryClient, createWrapper } from "./test-utils";

const fetchCategories = vi.fn().mockResolvedValue(["cat-1"]);

vi.mock("../../api", () => ({
  fetchCategories,
  categoriesQueryKeys,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useCategoriesQuery", () => {
  it("returns categories data", async () => {
    const { useCategoriesQuery } = await import("../use-categories-query");
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(() => useCategoriesQuery(baseUrl), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(["cat-1"]);
    });

    expect(fetchCategories).toHaveBeenCalledWith(baseUrl);
  });
});
