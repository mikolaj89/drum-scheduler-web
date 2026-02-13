import type { FastifyReply, FastifyRequest } from "fastify";
import { deleteSessionExercise as deleteSessionExerciseDb } from "../../db/session-exercises";
import { getFormattedErrorBody } from "../../utils/response";

type Params = { sessionid?: string; exerciseid?: string };

export const deleteSessionExercise = async (
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) => {
  try {
    const { sessionid, exerciseid } = request.params || {};
    if (sessionid === undefined || exerciseid === undefined) {
      reply
        .status(400)
        .send(
          getFormattedErrorBody("Missing session or exercise id", "BAD_REQUEST")
        );
      return;
    }

    const result = await deleteSessionExerciseDb(
      parseInt(sessionid),
      parseInt(exerciseid)
    );
    if (result) {
      reply.status(200).send(result.command);
    } else {
      reply
        .status(404)
        .send(getFormattedErrorBody("Session exercise not found", "NOT_FOUND"));
    }
  } catch (error) {
    console.error("Error deleting session exercise:", error);
    reply
      .status(500)
      .send(
        getFormattedErrorBody(
          "Failed to delete session exercise",
          "INTERNAL_SERVER_ERROR"
        )
      );
  }
};
