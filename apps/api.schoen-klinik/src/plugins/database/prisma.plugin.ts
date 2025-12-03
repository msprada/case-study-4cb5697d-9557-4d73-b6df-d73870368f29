import fp from 'fastify-plugin';
import { type FastifyInstance, type FastifyPluginAsync } from 'fastify';
import { PrismaClient } from './prisma/generated/prisma/client.js';

const prismaPlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
  const prisma = new PrismaClient();

  await prisma.$connect();

  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async (fastifyInstance: FastifyInstance) => {
    await fastifyInstance.prisma.$disconnect();
  });

  fastify.addHook('onError', async (request, reply, error) => {
    await fastify.prisma.$disconnect();
    console.error('Prisma disconnected due to an error:', error);
  });
});

export default prismaPlugin;
