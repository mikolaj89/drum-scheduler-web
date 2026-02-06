import type { FastifyReply, FastifyRequest } from "fastify";
import { getSessionExercises as getSessionExercisesDb } from "../../db/sessionExercises";
import { getFormattedErrorBody } from "../../utils/response";

type Params = { id?: string };

export const getSessionExercises = async (
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

    const result = await getSessionExercisesDb(parseInt(id));
    if (result) {
      reply.send(result);
    } else {
      reply
        .status(404)
        .send(getFormattedErrorBody("Session not found", "NOT_FOUND"));
    }
  } catch (error) {
    console.error("Error fetching session exercises:", error);
    reply
      .status(500)
      .send(
        getFormattedErrorBody(
          "Failed to fetch session exercises",
          "INTERNAL_SERVER_ERROR"
        )
      );
  }
};
