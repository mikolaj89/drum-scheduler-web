import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import exercisesRoutes from "./routes/exercises";
import sessionsRoutes from "./routes/sessions";
import sessionExercisesRoutes from "./routes/sessionExercises";
import categoriesRoutes from "./routes/categories";

dotenv.config();
dotenv.config({ path: "local.env" });

const fastify = Fastify({
  logger: false,
});

fastify.addHook("onRequest", async (request) => {
  console.log(`${request.method} ${request.url}`);
});

await fastify.register(cors, {
  origin: "http://localhost:3000",
});

fastify.get("/health", async () => ({ ok: true }));

await fastify.register(exercisesRoutes);
await fastify.register(sessionsRoutes);
await fastify.register(sessionExercisesRoutes);
await fastify.register(categoriesRoutes);

const PORT = Number(process.env.PORT ?? 8000);

fastify.listen({ port: PORT }).then(() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
