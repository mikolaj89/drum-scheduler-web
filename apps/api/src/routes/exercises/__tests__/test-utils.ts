import Fastify from "fastify";
import exercisesRoutes from "../../exercises";

export const buildExercisesServer = async () => {
  const app = Fastify({ logger: false });
  await app.register(exercisesRoutes);
  return app;
};
