import type { FastifyReply, FastifyRequest } from "fastify";
import { addSession } from "../../db/sessions";
import type { SessionInput } from "../../db/types";
import {
  ApiSuccessResponse,
  getFormattedErrorBody,
} from "../../utils/response";

export type CreateSessionResponse = { id: number };

type ApiResponse = ApiSuccessResponse<CreateSessionResponse>;

type Body = SessionInput;

export const createSession = async (
  request: FastifyRequest<{ Body: Body }>,
  reply: FastifyReply
) => {
  try {
    const { name, notes } = request.body as Body;

    if (typeof name !== "string" || typeof notes !== "string") {
      console.error("Invalid input data:", { name, notes });
      reply
        .status(400)
        .send(getFormattedErrorBody("Invalid input", "BAD_REQUEST"));
      return;
    }

    const result = await addSession({
      name,
      notes,
    });
    reply.status(201);
    if (result.length === 1) {
      const { id } = result[0];
      reply.send({
        data: {
          id,
        },
      } as ApiResponse);
    }
  } catch (error) {
    console.error("Error creating session:", error);
    reply
      .status(500)
      .send(
        getFormattedErrorBody("Internal server error", "INTERNAL_SERVER_ERROR")
      );
  }
};
