import type { FastifyInstance } from "fastify";
import { patchOrderHandler } from "./sessions/patch-order";
import { getSessionExercises } from "./sessions/get-session-exercises";
import { addSessionExercise } from "./sessions/add-session-exercise";
import { deleteSessionExercise } from "./sessions/delete-session-exercise";

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
