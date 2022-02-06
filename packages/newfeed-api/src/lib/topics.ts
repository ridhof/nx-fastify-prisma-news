import { PrismaClient, Topic } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: { url: `${process.env.DATABASE_PROVIDER}://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}` }
    }
})

interface ResponseFormatArray {
    count: number,
    data: Topic[],
    total_pages: number,
    page: number,
    limit: number,
    error: boolean,
    error_message: string
};

const getTopics = async function (page: number, limit: number): Promise<ResponseFormatArray> {
    const skip = (page - 1) * limit;
    const take = limit;
    let total = 0;
    let topics = [];
    let error = false;
    let errorMessage = "";

    try {
        total = await prisma.topic.count({
            where: { deleted: false }
        });
        topics = await prisma.topic.findMany({
            skip: skip,
            take: take,
            where: { deleted: false },
            orderBy: {
                name: 'asc'
            }
        });
    } catch (err) {
        error = true;
        errorMessage = "Unable to fetch data";
    }
    const response = {
        count: total,
        data: topics,
        total_pages: total != 0 ? Math.ceil(total / limit) : 0,
        page: page,
        limit: limit,
        error: error,
        error_message: errorMessage
    };
    return response;
}

const getSingleTopic = async function (topicID: number): Promise<ResponseFormatArray> {
    let topic = null;
    let error = false;
    let errorMessage = "";
    try {
        topic = await prisma.topic.findFirst({
            where: { id: topicID, deleted: false }
        });
    } catch (err) {
        error = true;
        errorMessage = "Unable to fetch topic";
    }
    const response = {
        count: topic ? 1 : 0,
        data: topic,
        total_pages: topic ? 1 : 0,
        page: 1,
        limit: 1,
        error: error,
        error_message: errorMessage
    };
    return response;
}

const createTopic = async function (newName: string ): Promise<ResponseFormatArray> {
    let topic = null;
    let error = false;
    let errorMessage = "";
    try {
        topic = await prisma.topic.create({
            data: { name: newName }
        });
    } catch (err) {
        error = true;
        errorMessage = "Unable to create topic.";
    }
    const response = {
        count: topic ? 1 : 0,
        data: topic,
        total_pages: topic ? 1 : 0,
        page: 1,
        limit: 1,
        error: error,
        error_message: errorMessage
    };
    return response
}

const updateTopic = async function (oldId: number, newName: string): Promise<ResponseFormatArray> {
    let topic = null;
    let error = false;
    let errorMessage = "";

    try {
        topic = await prisma.topic.update({
            where: { id: oldId },
            data: { name: newName }
        });
    } catch (err) {
        error = true;
        errorMessage = "Unable to update topic.";
    }

    const response = {
        count: topic ? 1 : 0,
        data: topic,
        total_pages: topic ? 1 : 0,
        page: 1,
        limit: 1,
        error: error,
        error_message: errorMessage
    };
    return response
};

const deleteTopic = async function (oldId: number): Promise<ResponseFormatArray> {
    let error = false;
    let errorMessage = "";
 
    try {
        await prisma.topic.delete({
            where: { id: oldId }
        });
    } catch (err) {
        error = true;
        errorMessage = "Unable to delete topic.";
    }

    const response = {
        count: 0,
        data: null,
        total_pages: 0,
        page: 0,
        limit: 0,
        error: error,
        error_message: errorMessage
    };
    return response
}

export { getTopics, getSingleTopic, createTopic, updateTopic, deleteTopic }