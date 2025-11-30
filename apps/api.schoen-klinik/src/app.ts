import Fastify from 'fastify';
import cors from '@fastify/cors';
import configureEnv from './extensions/config.extension.js';
import { schema, resolvers } from './plugins/graphql/types.js'
import { codegenMercurius } from 'mercurius-codegen';
import prismaPlugin from './plugins/database/prisma.plugin.js';
import anamnesisRoutes from './routes/anamnesis.js';

const fastify = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:mm:ss Z',
                ignore: 'pid,hostname'
            }
        }
    },
});


//TODO Implement Authentication/ Authorisation
//TODO Connect to Database
fastify.register(import('mercurius'), {
    schema,
    resolvers,
    // RECOMMANDATION: do not use in production
    // for case study we keep it 
    graphiql: true
});



// Configure env first
await configureEnv(fastify);

// Enable Prisma Client
await fastify.register(prismaPlugin);

await fastify.register(cors, {
    origin: '*',
})

// Register route plugins
await fastify.register(anamnesisRoutes, { prefix: '/api/anamnesis' })

// Root route
fastify.get('/', async (request, reply) => {
    return { message: `Welcome to the API which is the best ever seen. Following config for is active KEY:${fastify.config.KEY}` };
});

// Start server
const start = async () => {
    try {
        codegenMercurius(fastify, {
            targetPath: './src/plugins/graphql/generated-files/generated.ts',
        }).catch(console.error)

        await fastify.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

fastify.addHook('preValidation', async function hook (request, reply) {
    console.log({ headers: request.headers, url: request.url, method: request.method, body:request.body })
  })

start()
