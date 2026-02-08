import { ApiClient } from "../api-client";

export const deleteSession = async (baseUrl: string, sessionId: number) => {
  const apiClient = new ApiClient(baseUrl);
  const result = await apiClient.delete<null>(`/sessions/${sessionId}`);

  if ("error" in result) {
    throw new Error(result.error.message);
  }

  return result.data;
};
