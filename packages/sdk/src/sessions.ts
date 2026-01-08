import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateSessionBody,
  CreateSessionBodySchema,
  CreateSessionResponseSchema,
  GetSessionsResponseSchema,
} from "@drum-scheduler/contracts";
import { DrumSchedulerSdkConfig, requestJson } from "./http.js";

export const sessionsQueryKeys = {
  all: ["sessions"] as const,
};

export async function getSessions(config: DrumSchedulerSdkConfig) {
  return requestJson(config, "/sessions", { method: "GET" }, GetSessionsResponseSchema);
}

export async function createSession(config: DrumSchedulerSdkConfig, body: CreateSessionBody) {
  const validated = CreateSessionBodySchema.parse(body);
  return requestJson(
    config,
    "/sessions",
    { method: "POST", body: JSON.stringify(validated) },
    CreateSessionResponseSchema
  );
}

export function useSessionsQuery(config: DrumSchedulerSdkConfig) {
  return useQuery({
    queryKey: sessionsQueryKeys.all,
    queryFn: () => getSessions(config),
  });
}

export function useCreateSessionMutation(config: DrumSchedulerSdkConfig) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateSessionBody) => createSession(config, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sessionsQueryKeys.all });
    },
  });
}
