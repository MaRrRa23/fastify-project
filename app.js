import fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyAutoload from '@fastify/autoload';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const fastifyInstance = fastify({
    logger: true
});

// Is it necessary to put in try-catch?
try {
    await fastifyInstance.register(fastifyEnv, {
        dotenv: true,
        confKey: 'config',
        schema: {
            type: 'object',
            required: ['PORT'],
            properties: {
                PORT: { type: 'string' },
                HASH_ROUNDS: { type: 'number' }
            }
        }
    });
} catch (e) {
    fastifyInstance.log.error(e);
}

const pluginLoadOptions = {};
await fastifyInstance.register(fastifyAutoload, {
    dir: join(dirname(fileURLToPath(import.meta.url)), 'routes'),
    options: pluginLoadOptions
});

await fastifyInstance.register(fastifyAutoload, {
    dir: join(dirname(fileURLToPath(import.meta.url)), 'plugins'),
    dirNameRoutePrefix: false,
    options: pluginLoadOptions
});

fastifyInstance.listen({ port: fastifyInstance.config.PORT }, () => {
    fastifyInstance.log.info(`started server on PORT ${fastifyInstance.config.PORT}`)
})