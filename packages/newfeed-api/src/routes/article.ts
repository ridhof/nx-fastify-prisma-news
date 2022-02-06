import { FastifyInstance, FastifyRequest, FastifyPluginOptions, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { getArticles, getSingleArticle, createArticle, updateArticle, deleteArticle } from '../lib/articles';

interface ListQueryString {
    page: string;
    limit: string;
    topicID: string;
    status: string;
}

interface SingleParamString {
    id: string;
}

interface ArticleCreate {
    title: string,
    content: string,
    status: string,
    topics: { id: number }[]
}

interface ArticleUpdate {
    id: string,
    title: string,
    content: string,
    status: string,
    topics: { id: number }[]
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

    server.post<{Body: ArticleCreate}>('/articles', {}, async (request, reply) => {
        if (!request.body.title || !request.body.content || !request.body.status || !request.body.topics || request.body.topics.length == 0) {
            const response = {
                count: 0,
                data: null,
                total_pages: 0,
                page: 1,
                limit: 1,
                error: true,
                error_message: "Please complete the form."
            };
            return reply.code(500).send(response);
        }

        try {
            const { title, content, status, topics } = request.body;
            const article = await createArticle(title, content, status, topics);
            const responseCode = article.error ? 500 : 200;
            return reply.code(responseCode).send(article);
        } catch (error) {
            request.log.error(error);
            const response = {
                count: 0,
                data: null,
                total_pages: 0,
                page: 1,
                limit: 1,
                error: true,
                error_message: Object.keys(error).length != 0 ? error : "Unknown error"
            };
            return reply.code(500).send(response);
        }
    })

    server.patch<{Body: ArticleUpdate}>('/articles', {}, async (request, reply) => {
        if (!request.body.id || !request.body.title || !request.body.content || !request.body.status || !request.body.topics || request.body.topics.length == 0) {
            const response = {
                count: 0,
                data: null,
                total_pages: 0,
                page: 1,
                limit: 1,
                error: true,
                error_message: "Please complete the form."
            };
            return reply.code(500).send(response);
        }

        try {
            const { id, title, content, status, topics } = request.body;
            const article = await updateArticle(parseInt(id) || 0, title, content, status, topics);
            const responseCode = article.error ? 500 : 200;
            return reply.code(responseCode).send(article);
        } catch (error) {
            request.log.error(error);
            const response = {
                count: 0,
                data: null,
                total_pages: 0,
                page: 1,
                limit: 1,
                error: true,
                error_message: Object.keys(error).length != 0 ? error : "Unknown error"
            };
            return reply.code(500).send(response);
        }
    })

    server.delete<{Querystring: SingleParamString}>('/articles', {}, async (request, reply) => {
        if (!request.query.id) {
            const response = {
                count: 0,
                data: null,
                total_pages: 0,
                page: 1,
                limit: 1,
                error: true,
                error_message: "Please select an article to delete."
            };
            return reply.code(500).send(response);
        }
        try {
            const { id } = request.query;
            const article = await deleteArticle(parseInt(id) || 0);
            const responseCode = article.error ? 500 : 200;
            return reply.code(responseCode).send(article);
        } catch (error) {
            request.log.error(error);
            const response = {
                count: 0,
                data: null,
                total_pages: 0,
                page: 1,
                limit: 1,
                error: true,
                error_message: Object.keys(error).length != 0 ? error : "Unknown error"
            };
            return reply.code(500).send(response);
        }
    })
}

export default fp(ArticleRoute);