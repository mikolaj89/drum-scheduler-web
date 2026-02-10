import "fastify";

export type Role = "OWNER" | "ADMIN" | "USER";

type Db = {
  query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }>;
};

declare module "fastify" {
  interface FastifyInstance {
    db: Db;
  }
  interface FastifyRequest {
    auth?: { userId: string; accountId: string; role: Role };
  }
}
