import fastifyEnv from "@fastify/env";
import { type FastifyInstance } from "fastify";

const schema = {
    type: "object",
    required: ["KEY"],
    properties: {
        KEY: { type: "string", default: "" },
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
        }
    }
};

export default async function configExtension(fastify: FastifyInstance) {
    await fastify.register(fastifyEnv, options);
    return fastify
}