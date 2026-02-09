import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const baseUrl = "http://localhost:8000";

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

export const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children?: any }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

export const mockExercise = {
  id: 1,
  name: "Test Exercise",
  categoryId: "cat-1",
} as any;

export const mockExerciseInsert = {
  name: "New Exercise",
  categoryId: "cat-1",
} as any;

export const mockSession = {
  id: 123,
  name: "Test Session",
  notes: null,
  totalDuration: 42,
  exercises: [],
} as any;

export const mockSessions = [
  {
    id: 1,
    name: "Session A",
    notes: null,
  },
] as any[];

export const mockSessionInsert = {
  name: "New Session",
  notes: null,
} as any;

export const mockExercises = [mockExercise];

export const exercisesQueryKeys = {
  all: ["exercises"] as const,
  byId: (exerciseId: number) => ["exercises", exerciseId] as const,
  filtered: (filters: { name: string | null; categoryId: string | null }) =>
    ["exercises", filters.name, filters.categoryId] as const,
};

export const categoriesQueryKeys = {
  all: ["categories"] as const,
  byId: (categoryId: string) => ["categories", categoryId] as const,
  exercises: (categoryId: string) =>
    ["categories", categoryId, "exercises"] as const,
};

export const sessionsQueryKeys = {
  all: ["sessions"] as const,
  byId: (sessionId: number) => ["sessions", sessionId] as const,
};
