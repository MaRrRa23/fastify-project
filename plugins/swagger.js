import fastifyPlugin from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const { version } = JSON.parse(
    await readFile(
        join(fileURLToPath(dirname(import.meta.url)) + '/../package.json')
    )
);

async function swaggerGenerator(fastify, opts) {
    await fastify.register(fastifySwagger, {
        swagger: {
            info: {
                title: 'Fastify-project',
                description: 'Fastify-project documentation',
                version
            },
            externalDocs: {
                url: 'https://github.com/MaRrRa23/fastify-project',
                description: 'Find more info here'
            },
            host: 'localhost:8000',
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json', 'text/html'],
            securityDefinitions: {
                Bearer: {
                    type: 'apiKey',
                    name: 'Bearer',
                    in: 'header'
                },
                Csrf: {
                    type: 'apiKey',
                    name: 'x-csrf-token',
                    in: 'header'
                }
            }
        },
        exposeRoute: fastify.config.NODE_ENV !== 'production'
    });

    if (fastify.config.NODE_ENV !== 'production') {
        await fastify.register(fastifySwaggerUi, {
            routePrefix: '/documentation'
        });
    }
}

export default fastifyPlugin(swaggerGenerator, {
    name: 'swaggerGenerator'
});
