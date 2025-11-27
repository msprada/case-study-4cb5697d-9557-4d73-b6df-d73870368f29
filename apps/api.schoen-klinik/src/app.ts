import Fastify from 'fastify';
import configureEnv from './extensions/config.extension.js';
import {schema, resolvers} from './plugins/graphQL/types.js'

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
await configureEnv(fastify)


// Root route
fastify.get('/', async (request, reply) => {
    return { message: `Welcome to the API which is the best ever seen. Following config for is active KEY:${fastify.config.KEY}`};
}); 

// Start server
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start()
