import type { FastifyReply, FastifyRequest } from "fastify";
import { getExerciseById as getExerciseByIdDb } from "../../db/exercises";
import { getFormattedErrorBody } from "../../utils/response";

type Params = { id?: string };

export const getExerciseById = async (
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

    const result = await getExerciseByIdDb(parseInt(id));
    if (result.length > 0) {
      reply.send({ data: result[0] });
    } else {
      reply
        .status(404)
        .send(getFormattedErrorBody("Exercise not found", "NOT_FOUND"));
    }
  } catch (error) {
    console.error("Error fetching exercise:", error);
    reply
      .status(500)
      .send(
        getFormattedErrorBody("Failed to fetch exercise", "INTERNAL_SERVER_ERROR")
      );
  }
};
