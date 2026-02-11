import type { FastifyInstance } from "fastify";
import { login } from "./auth/login";
import { refresh } from "./auth/refresh";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/login", login);
  fastify.post("/auth/refresh", refresh);
}
