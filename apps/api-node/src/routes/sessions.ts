import type { FastifyInstance } from "fastify";
import { createSession } from "./sessions/createSession";
import { getSessions } from "./sessions/getSessions";
import { getSessionById } from "./sessions/getSessionById";
import { deleteSession } from "./sessions/deleteSession";

export default async function sessionsRoutes(fastify: FastifyInstance) {
  fastify.get("/sessions", getSessions);
  fastify.get("/sessions/:id", getSessionById);
  fastify.post("/sessions", createSession);
  fastify.delete("/sessions/:id", deleteSession);
}
