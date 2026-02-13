import type { FastifyReply, FastifyRequest } from "fastify";
import type { SessionExercisesOrderInput } from "../../api-types";
import { reorderSessionExercises } from "../../db/session-exercises";
import { getFormattedErrorBody } from "../../utils/response";

type Params = { id?: string };

type Body = SessionExercisesOrderInput;

export async function patchOrderHandler(
  request: FastifyRequest<{ Params: Params; Body: Body }>,
  reply: FastifyReply
) {
  try {
    const sessionId = request.params?.id;
    const body = request.body as Body;
    const { exercises } = body;

    if (!exercises || exercises.length === 0 || !sessionId) {
      reply
        .status(400)
        .send(getFormattedErrorBody("No exercises provided", "BAD_REQUEST"));
      return;
    }

    await reorderSessionExercises(parseInt(sessionId), exercises);

    reply.status(200).send({ data: null });
  } catch (error) {
    console.error("Error updating session:", error);
    reply
      .status(500)
      .send(getFormattedErrorBody("Failed to update session", "INTERNAL_SERVER_ERROR"));
  }
}
