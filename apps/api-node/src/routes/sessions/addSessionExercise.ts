import type { FastifyReply, FastifyRequest } from "fastify";
import { addSessionExercise as addSessionExerciseDb } from "../../db/sessionExercises";
import { getFormattedErrorBody } from "../../utils/response";

type Params = { sessionid?: string; exerciseid?: string };

export const addSessionExercise = async (
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

    const result = await addSessionExerciseDb({
      sessionId: parseInt(sessionid),
      exerciseId: parseInt(exerciseid),
    });

    reply.status(201).send(result.command);
  } catch (error) {
    console.error("Error adding session exercise:", error);
    reply
      .status(500)
      .send(
        getFormattedErrorBody(
          "Failed to add session exercise",
          "INTERNAL_SERVER_ERROR"
        )
      );
  }
};
