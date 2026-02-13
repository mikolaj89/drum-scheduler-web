import type { FastifyReply, FastifyRequest } from "fastify";
import { deleteCategory as deleteCategoryDb } from "../../db/categories";
import { getFormattedErrorBody } from "../../utils/response";

type Params = { id?: string };

export const deleteCategory = async (
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

    const result = await deleteCategoryDb(parseInt(id));
    if (result) {
      reply.send(result);
    } else {
      reply
        .status(404)
        .send(getFormattedErrorBody("Category not found", "NOT_FOUND"));
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    reply
      .status(500)
      .send(
        getFormattedErrorBody("Failed to delete category", "INTERNAL_SERVER_ERROR")
      );
  }
};
