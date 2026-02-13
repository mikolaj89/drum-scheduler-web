import type { FastifyReply, FastifyRequest } from "fastify";
import { getSessions as getSessionsDb } from "../../db/sessions";
import { getFormattedErrorBody } from "../../utils/response";

export const getSessions = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const result = await getSessionsDb();
    reply.status(200).send({ data: result });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    reply
      .status(500)
      .send(
        getFormattedErrorBody("Failed to fetch sessions", "INTERNAL_SERVER_ERROR")
      );
  }
};
