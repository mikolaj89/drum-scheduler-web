import type { FastifyReply, FastifyRequest } from "fastify";
import { deleteSession as deleteSessionDb } from "../../db/sessions";
import { getFormattedErrorBody } from "../../utils/response";

type Params = { id?: string };

export const deleteSession = async (
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) => {
  try {
    const id = request.params?.id;
    if (!id) {
      reply
        .status(400)
        .send(getFormattedErrorBody("Missing session id", "BAD_REQUEST"));
      return;
    }

    const result = await deleteSessionDb(parseInt(id));
    if (result) {
      reply.status(200).send(result.command);
    } else {
      reply
        .status(404)
        .send(getFormattedErrorBody("Session not found", "NOT_FOUND"));
    }
  } catch (error) {
    console.error("Error deleting session:", error);
    reply
      .status(500)
      .send(
        getFormattedErrorBody("Failed to delete session", "INTERNAL_SERVER_ERROR")
      );
  }
};
