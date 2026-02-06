import type { FastifyReply, FastifyRequest } from "fastify";
import { addExercise as addExerciseDb } from "../../db/exercises";
import { getExerciseErrors } from "../../utils/validation/exercise-validation";
import { getFormattedErrorBody } from "../../utils/response";
import type { ExerciseInput } from "../../db/types";

type Body = ExerciseInput;

export const createExercise = async (
  request: FastifyRequest<{ Body: Body }>,
  reply: FastifyReply
) => {
  try {
    const body = request.body as Body;

    const errors = getExerciseErrors(body);
    if (errors.length > 0) {
      reply
        .status(400)
        .send(getFormattedErrorBody("Validation failed", "VALIDATION_ERROR"));
      return;
    }

    const result = await addExerciseDb({
      name: body.name,
      categoryId: body.categoryId,
      description: body.description,
      durationMinutes: body.durationMinutes,
      bpm: body.bpm,
    });

    reply.status(201).send({ data: result, success: true });
  } catch (error) {
    console.error("Failed to add exercise:", error);
    reply
      .status(500)
      .send(
        getFormattedErrorBody("Failed to add exercise", "INTERNAL_SERVER_ERROR")
      );
  }
};
