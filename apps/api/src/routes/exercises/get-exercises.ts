import type { FastifyReply, FastifyRequest } from "fastify";
import { filterExercises } from "../../db/exercises";
import { getFormattedErrorBody } from "../../utils/response";

type ExercisesQuery = {
  name?: string;
  categoryId?: string;
};

export const getExercises = async (
  request: FastifyRequest<{ Querystring: ExercisesQuery }>,
  reply: FastifyReply
) => {
  try {
    const { name, categoryId } = request.query ?? {};
    const exercises = await filterExercises({
      name: name ?? null,
      categoryId: categoryId ?? null,
    });
    reply.send({ data: exercises });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    reply.status(500).send(
      getFormattedErrorBody("Failed to fetch exercises", "INTERNAL_SERVER_ERROR")
    );
  }
};
