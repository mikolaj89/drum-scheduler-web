import type { FastifyInstance } from "fastify";
import { getExercises } from "./exercises/get-exercises";
import { getExerciseById } from "./exercises/get-exercise-by-id";
import { createExercise } from "./exercises/create-exercise";
import { updateExercise } from "./exercises/update-exercise";
import { deleteExercise } from "./exercises/delete-exercise";

export default async function exercisesRoutes(fastify: FastifyInstance) {
  fastify.get("/exercises", getExercises);
  fastify.get("/exercises/:id", getExerciseById);
  fastify.post("/exercises", createExercise);
  fastify.put("/exercises/:id", updateExercise);
  fastify.delete("/exercises/:id", deleteExercise);
}
