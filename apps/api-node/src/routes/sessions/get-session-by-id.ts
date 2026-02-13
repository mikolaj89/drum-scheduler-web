import type { FastifyReply, FastifyRequest } from "fastify";
import { getSession as getSessionDb } from "../../db/sessions";
import { getSessionExercises as getSessionExercisesDb } from "../../db/session-exercises";
import { getFormattedErrorBody } from "../../utils/response";
import { getFormattedSession } from "../../utils/session";

type Params = { id?: string };

export const getSessionById = async (
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

    const result = await getSessionDb(parseInt(id));
    if (result.length === 0) {
      reply
        .status(404)
        .send(getFormattedErrorBody("Session not found", "NOT_FOUND"));
    } else {
      const exercises = await getSessionExercisesDb(parseInt(id));
      const sessionWithExercises = getFormattedSession(result[0], exercises);
      reply.status(200).send({ data: sessionWithExercises });
    }
  } catch (error) {
    console.error("Error fetching session:", error);
    reply
      .status(500)
      .send(
        getFormattedErrorBody("Failed to fetch session", "INTERNAL_SERVER_ERROR")
      );
  }
};
