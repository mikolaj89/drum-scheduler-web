import type { FastifyReply, FastifyRequest } from "fastify";
import { editExercise as editExerciseDb } from "../../db/exercises";
import { getExerciseErrors } from "../../utils/validation/exercise-validation";
import { getFormattedErrorBody } from "../../utils/response";
import type { ExerciseInput } from "../../db/types";

type Params = { id?: string };

type Body = ExerciseInput;

export const updateExercise = async (
  request: FastifyRequest<{ Params: Params; Body: Body }>,
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

    const body = request.body as Body;
    const errors = getExerciseErrors(body);
    if (errors.length > 0) {
      reply
        .status(400)
        .send(getFormattedErrorBody("Validation failed", "VALIDATION_ERROR"));
      return;
    }

    const result = await editExerciseDb(body, parseInt(id));
    if (result.rowCount === 0) {
      reply
        .status(404)
        .send(getFormattedErrorBody("Exercise not found", "NOT_FOUND"));
    } else {
      reply.status(200).send({ success: true });
    }
  } catch (error) {
    console.error("Error updating exercise:", error);
    reply
      .status(500)
      .send(
        getFormattedErrorBody("Failed to update exercise", "INTERNAL_SERVER_ERROR")
      );
  }
};
