import fastifyPlugin from 'fastify-plugin';
import fastifyPostgres from '@fastify/postgres';

async function connectToDb(fastify, opts) {
    await fastify.register(fastifyPostgres, {
        database: fastify.config.DB_NAME,
        host: fastify.config.DB_HOST,
        user: fastify.config.DB_USER,
        password: fastify.config.DB_PASSWORD,
        port: fastify.config.DB_PORT,
        keepAlive: true
    });

    console.log(fastify.config)

    await fastify.pg.connect();
    fastify.log.info(`Connected to postgres on PORT ${fastify.config.DB_PORT}`);
}

export default fastifyPlugin(connectToDb);
