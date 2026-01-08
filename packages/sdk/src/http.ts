import { z } from "zod";

export type DrumSchedulerSdkConfig = {
  baseUrl: string;
  headers?: Record<string, string>;
};

export class DrumSchedulerApiError extends Error {
  readonly errorCode: string;
  readonly fieldErrors?: Record<string, string>;

  constructor(message: string, errorCode: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "DrumSchedulerApiError";
    this.errorCode = errorCode;
    this.fieldErrors = fieldErrors;
  }
}

export async function requestJson<TSchema extends z.ZodTypeAny>(
  config: DrumSchedulerSdkConfig,
  path: string,
  init: RequestInit,
  responseSchema: TSchema
): Promise<z.infer<TSchema>> {
  const url = new URL(path, config.baseUrl).toString();

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(config.headers ?? {}),
      ...(init.headers ? (init.headers as Record<string, string>) : {}),
    },
  });

  const text = await response.text();
  const json = text.length ? JSON.parse(text) : null;

  // Validate shape regardless of HTTP status; your API encodes errors in body.
  const parsed = responseSchema.parse(json);
  return parsed;
}
