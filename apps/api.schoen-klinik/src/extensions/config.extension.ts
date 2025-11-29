import fastifyEnv from "@fastify/env";
import { type FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client/extension";

const schema = {
    type: "object",
    required: ["KEY", "DATABASE_URL"],
    properties: {
        KEY: { type: "string", default: "" },
        DATABASE_URL: { type: "string", default: "file:./data/schon-klinik.db" }
    },
} as const;

const options = {
    schema,
    dotenv: true,
    data: process.env,
};

declare module "fastify" {
    interface FastifyInstance {
        config: {
            KEY: string;
            DATABASE_URL:string
        },
        prisma: PrismaClient
    }
};

export default async function configExtension(fastify: FastifyInstance) {
    await fastify.register(fastifyEnv, options);
    return fastify
}