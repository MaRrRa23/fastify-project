import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const { version } = JSON.parse(
    await readFile(
        join(fileURLToPath(dirname(import.meta.url)) + '/../package.json')
    )
);

export const autoPrefix = '/api';

export default async function exposeApiVersion(fastify, opts) {
    fastify.route({
        method: 'GET',
        path: '/version',
        handler: onVersion,
        schema: {
            description: 'Returns status and version of the application',
            response: {
                200: {
                    type: 'object',
                    properties: {
                        version: { type: 'string', default: '1.1.0' },
                        status: { type: 'string', default: 'ok' }
                    }
                }
            }
        }
    });

    async function onVersion(request, reply) {
        const { rows: statusFromDb } = await fastify.pg.query(
            "SELECT 'ok' AS status"
        );
        return { status: statusFromDb.pop()['status'], version };
    }
}
