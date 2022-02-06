import { FastifyInstance, FastifyPluginOptions, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { getTopics, getSingleTopic, createTopic, updateTopic, deleteTopic } from '../lib/topics';

interface ListQueryString {
    page: string;
    limit: string;
}

interface SingleParamString {
    id: string;
}

interface TopicCreate {
    name: string;
}

interface TopicUpdate {
    id: string;
    name: string;
}

const TopicRoute: FastifyPluginAsync = async (server: FastifyInstance, options: FastifyPluginOptions) => {
    server.get<{Querystring: ListQueryString}>('/topics', {}, async (request, reply) => {
        try {
            const { page, limit } = request.query;
            const topics = await getTopics(parseInt(page) || 1, parseInt(limit) || 10);
            const responseCode = topics.error ? 500 : 200;
            return reply.code(responseCode).send(topics);
        } catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    });

    server.get<{Params: SingleParamString}>('/topics/:id', {}, async (request, reply) => {
        try {
            const { id } = request.params;
            const topic = await getSingleTopic(parseInt(id) || 0);
            const responseCode = topic.error ? 500 : 200;
            return reply.code(responseCode).send(topic);
        } catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    });

    server.post<{Body: TopicCreate}>('/topics', {}, async (request, reply) => {
        if (!request.body.name) {
            const response = {
                count: 0,
                data: null,
                total_pages: 0,
                page: 1,
                limit: 1,
                error: true,
                error_message: "Please fill the name property."
            };
            return response;
        }
        try {
            const { name } = request.body;
            const topic = await createTopic(name);
            const responseCode = topic.error ? 500 : 200;
            return reply.code(responseCode).send(topic);
        } catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    });

    server.patch<{Body: TopicUpdate}>('/topics', {}, async (request, reply) => {
        if (!request.body.id || !request.body.name) {
            const response = {
                count: 0,
                data: null,
                total_pages: 0,
                page: 1,
                limit: 1,
                error: true,
                error_message: "Please select the topic you want to change and change the name with valid format."
            };
            return response;
        }
        try {
            const { id, name } = request.body;
            const topic = await updateTopic(parseInt(id) || 0, name);
            const responseCode = topic.error ? 500 : 200;
            return reply.code(responseCode).send(topic);
        } catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    });

    server.delete<{Querystring: TopicUpdate}>('/topics', {}, async (request, reply) => {
        if (!request.query.id) {
            const response = {
                count: 0,
                data: null,
                total_pages: 0,
                page: 1,
                limit: 1,
                error: true,
                error_message: "Please select the topic you want to delete."
            };
            return response;
        }
        try {
            const { id } = request.query;
            const topic = await deleteTopic(parseInt(id) || 0);
            const responseCode = topic.error ? 500 : 200;
            return reply.code(responseCode).send(topic);
        } catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    });
}

export default fp(TopicRoute);