import { FastifyInstance, FastifyRequest, FastifyPluginOptions, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { getArticles, getSingleArticle } from '../lib/articles';

interface ListQueryString {
    page: string;
    limit: string;
    topicID: string;
    status: string;
}

interface SingleParamString {
    id: string;
}

const ArticleRoute: FastifyPluginAsync = async (server: FastifyInstance, options: FastifyPluginOptions) => {
    server.get<{Querystring: ListQueryString}>('/articles', {}, async (request, reply) => {
        try {
            const { page, limit, topicID, status } = request.query;
            let filterByStatus = false;
            let filterByTopic = false;
            if (topicID) filterByTopic = true;
            if (status) filterByStatus = true;
            const articles = await getArticles(parseInt(page) || 1, parseInt(limit) || 10, filterByTopic, parseInt(topicID) || 0, filterByStatus, status);
            const responseCode = articles.error ? 500 : 200;
            return reply.code(responseCode).send(articles);
        } catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    });

    server.get<{Params: SingleParamString}>('/articles/:id', {}, async (request, reply) => {
        try {
            const { id } = request.params;
            const article = await getSingleArticle(parseInt(id) || 0);
            return reply.code(200).send(article);
        } catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    });
}

export default fp(ArticleRoute);