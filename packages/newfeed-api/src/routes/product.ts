import { FastifyInstance, FastifyPluginOptions, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { getProducts } from '../lib/products';

const ProductRoute: FastifyPluginAsync = async (server: FastifyInstance, options: FastifyPluginOptions) => {
    server.get('/products', {}, async (request, reply) => {
        try {
            const products = await getProducts()
            return reply.code(200).send(products)
        } catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    });
}

export default fp(ProductRoute);