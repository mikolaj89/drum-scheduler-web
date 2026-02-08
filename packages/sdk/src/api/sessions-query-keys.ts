export const sessionsQueryKeys = {
  all: ["sessions"] as const,
  byId: (sessionId: number) => ["sessions", sessionId] as const,
};
