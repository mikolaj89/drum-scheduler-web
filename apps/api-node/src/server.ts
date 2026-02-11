import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import cookie from "@fastify/cookie";
import { loadEnv } from "./config/env";
import { authConfig } from "./config/auth";
import exercisesRoutes from "./routes/exercises";
import sessionsRoutes from "./routes/sessions";
import sessionExercisesRoutes from "./routes/sessionExercises";
import categoriesRoutes from "./routes/categories";
import authRoutes from "./routes/auth";

dotenv.config();
dotenv.config({ path: "local.env" });

const env = loadEnv();
const auth = authConfig(env);

const fastify = Fastify({
  logger: false,
});


await fastify.register(cookie);

fastify.decorate("auth", auth);
fastify.decorate("env", env);

fastify.addHook("onRequest", async (request) => {
  console.log(`${request.method} ${request.url}`);
});

await fastify.register(cors, {
  origin: "http://localhost:3000",
  credentials: true,
});

fastify.get("/health", async () => ({ ok: true }));

await fastify.register(exercisesRoutes);
await fastify.register(sessionsRoutes);
await fastify.register(sessionExercisesRoutes);
await fastify.register(categoriesRoutes);
await fastify.register(authRoutes);

const PORT = Number(process.env.PORT ?? 8000);

fastify.listen({ port: PORT }).then(() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
