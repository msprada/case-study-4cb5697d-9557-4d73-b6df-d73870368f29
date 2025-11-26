import Fastify from 'fastify';

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


// Root route
fastify.get('/', async (request, reply) => {
    return { message: `Welcome to the API which is the best ever seen. ` };
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
