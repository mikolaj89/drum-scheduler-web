import type { FastifyInstance } from "fastify";
import { patchOrderHandler } from "./sessions/patchOrder";
import { getSessionExercises } from "./sessions/getSessionExercises";
import { addSessionExercise } from "./sessions/addSessionExercise";
import { deleteSessionExercise } from "./sessions/deleteSessionExercise";

export default async function sessionExercisesRoutes(fastify: FastifyInstance) {
  fastify.get("/sessions/:id/exercises", getSessionExercises);
  fastify.patch("/sessions/:id/exercises-order", patchOrderHandler);
  fastify.post(
    "/sessions/:sessionid/exercises/:exerciseid",
    addSessionExercise
  );
  fastify.delete(
    "/sessions/:sessionid/exercises/:exerciseid",
    deleteSessionExercise
  );
}
