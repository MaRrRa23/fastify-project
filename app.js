import FastifyFactory from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyAutoload from '@fastify/autoload';
import fastifySensible from '@fastify/sensible';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import fastifyPostgres from '@fastify/postgres';

const fastifyInstance = FastifyFactory({
    logger: true
});

// Is it necessary to put in try-catch?
try {
    await fastifyInstance.register(fastifyEnv, {
        dotenv: true,
        confKey: 'config',
        schema: {
            type: 'object',
            required: ['PORT', 'NODE_ENV'],
            properties: {
                PORT: { type: 'string' },
                NODE_ENV: {
                    type: 'string',
                    enum: ['development', 'production', 'test']
                },
                DB_NAME: { type: 'string' },
                DB_USER: { type: 'string' },
                DB_PASSWORD: { type: 'string' },
                DB_HOST: { type: 'string' },
                DB_PORT: { type: 'number' },
                HASH_ROUNDS: { type: 'string' },
                DOCKERIZED_HOST: { type: 'string' }
            }
        }
    });
} catch (e) {
    fastifyInstance.log.error(e);
}

await fastifyInstance.register(fastifySensible);

const pluginLoadOptions = {};
await fastifyInstance.register(fastifyAutoload, {
    dir: join(dirname(fileURLToPath(import.meta.url)), 'plugins'),
    options: pluginLoadOptions
});

await fastifyInstance.register(fastifyAutoload, {
    dir: join(dirname(fileURLToPath(import.meta.url)), 'routes'),
    dirNameRoutePrefix: false,
    options: pluginLoadOptions
});

fastifyInstance.listen({
    port: fastifyInstance.config.PORT,
    host: fastifyInstance.config.DOCKERIZED_HOST ?? 'localhost'
});
