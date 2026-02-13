import type { FastifyInstance } from "fastify";
import { createSession } from "./sessions/create-session";
import { getSessions } from "./sessions/get-sessions";
import { getSessionById } from "./sessions/get-session-by-id";
import { deleteSession } from "./sessions/delete-session";

export default async function sessionsRoutes(fastify: FastifyInstance) {
  fastify.get("/sessions", getSessions);
  fastify.get("/sessions/:id", getSessionById);
  fastify.post("/sessions", createSession);
  fastify.delete("/sessions/:id", deleteSession);
}
