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
  return requestJson(
    config,
    "/sessions",
    { method: "GET" },
    GetSessionsResponseSchema
  );
}

export async function createSession(
  config: DrumSchedulerSdkConfig,
  body: CreateSessionBody
) {
  const validated = CreateSessionBodySchema.parse(body);
  return requestJson(
    config,
    "/sessions",
    { method: "POST", body: JSON.stringify(validated) },
    CreateSessionResponseSchema
  );
}

export function useSessionsQuery(config: DrumSchedulerSdkConfig) {
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: sessionsQueryKeys.all,
    queryFn: () => getSessions(config),
  });

  if (data && "data" in data) {
    return { data: data.data, isSuccess, isLoading, error: null };
  }
  if (error) {
    console.error("Error fetching sessions:", error);
  }
  return { data: null, isLoading: isLoading, error: error };
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
