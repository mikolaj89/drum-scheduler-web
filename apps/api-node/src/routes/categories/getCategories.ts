import type { FastifyReply, FastifyRequest } from "fastify";
import { getCategories as getCategoriesDb } from "../../db/categories";
import { getFormattedErrorBody } from "../../utils/response";

export const getCategories = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const result = await getCategoriesDb();
    reply.send({ data: result });
  } catch (error) {
    console.error("Error fetching categories:", error);
    reply
      .status(500)
      .send(
        getFormattedErrorBody("Failed to fetch categories", "INTERNAL_SERVER_ERROR")
      );
  }
};
