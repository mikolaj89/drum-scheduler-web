import type { FastifyInstance } from "fastify";
import { getExercises } from "./exercises/getExercises";
import { getExerciseById } from "./exercises/getExerciseById";
import { createExercise } from "./exercises/createExercise";
import { updateExercise } from "./exercises/updateExercise";
import { deleteExercise } from "./exercises/deleteExercise";

export default async function exercisesRoutes(fastify: FastifyInstance) {
  fastify.get("/exercises", getExercises);
  fastify.get("/exercises/:id", getExerciseById);
  fastify.post("/exercises", createExercise);
  fastify.put("/exercises/:id", updateExercise);
  fastify.delete("/exercises/:id", deleteExercise);
}
