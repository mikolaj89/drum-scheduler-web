import type { FastifyReply, FastifyRequest } from "fastify";
import { getCategoryExercises as getCategoryExercisesDb } from "../../db/categories";
import { getFormattedErrorBody } from "../../utils/response";

type Params = { id?: string };

export const getCategoryExercises = async (
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) => {
  try {
    const id = request.params?.id;

    if (!id) {
      reply
        .status(400)
        .send(getFormattedErrorBody("Missing category id", "BAD_REQUEST"));
      return;
    }

    const result = await getCategoryExercisesDb(parseInt(id));
    if (result) {
      reply.send({ data: result });
    } else {
      reply
        .status(404)
        .send(
          getFormattedErrorBody("Category exercises not found", "NOT_FOUND")
        );
    }
  } catch (error) {
    console.error("Error fetching category exercises:", error);
    reply
      .status(500)
      .send(
        getFormattedErrorBody(
          "Failed to fetch category exercises",
          "INTERNAL_SERVER_ERROR"
        )
      );
  }
};
