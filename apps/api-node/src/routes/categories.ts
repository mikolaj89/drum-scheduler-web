import type { FastifyInstance } from "fastify";
import { getCategories } from "./categories/getCategories";
import { getCategoryExercises } from "./categories/getCategoryExercises";
import { deleteCategory } from "./categories/deleteCategory";

export default async function categoriesRoutes(fastify: FastifyInstance) {
  fastify.get("/categories", getCategories);
  fastify.get("/categories/:id/exercises", getCategoryExercises);
  fastify.delete("/categories/:id", deleteCategory);
}
