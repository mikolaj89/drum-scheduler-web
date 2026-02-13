import type { FastifyInstance } from "fastify";
import { getCategories } from "./categories/get-categories";
import { getCategoryExercises } from "./categories/get-category-exercises";
import { deleteCategory } from "./categories/delete-category";

export default async function categoriesRoutes(fastify: FastifyInstance) {
  fastify.get("/categories", getCategories);
  fastify.get("/categories/:id/exercises", getCategoryExercises);
  fastify.delete("/categories/:id", deleteCategory);
}
