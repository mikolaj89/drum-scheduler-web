import type { FastifyReply, FastifyRequest } from "fastify";
import { deleteExercise as deleteExerciseDb } from "../../db/exercises";
import { getFormattedErrorBody } from "../../utils/response";

type Params = { id?: string };

export const deleteExercise = async (
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) => {
  try {
    const id = request.params?.id;
    if (!id) {
      reply
        .status(400)
        .send(getFormattedErrorBody("Missing exercise id", "BAD_REQUEST"));
      return;
    }

    const result = await deleteExerciseDb(parseInt(id));

    if (result.rowCount === 0) {
      reply
        .status(404)
        .send(getFormattedErrorBody("Exercise not found", "NOT_FOUND"));
    } else {
      reply.status(204).send();
    }
  } catch (error) {
    console.error("Error deleting exercise:", error);
    reply
      .status(500)
      .send(
        getFormattedErrorBody("Failed to delete exercise", "INTERNAL_SERVER_ERROR")
      );
  }
};
