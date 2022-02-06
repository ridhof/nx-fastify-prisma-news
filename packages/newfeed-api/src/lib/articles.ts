import { PrismaClient, NewsArticle, ArticleStatus, Topic } from '@prisma/client'

const prisma = new PrismaClient()

interface ResponseFormatArray {
    count: number,
    data: NewsArticle[],
    total_pages: number,
    page: number,
    limit: number,
    error: boolean,
    error_message: string
};

const getArticles = async function (page: number, limit: number, filterByTopic: boolean, topicID: number, filterByStatus: boolean, articleStatus: string): Promise<ResponseFormatArray> {
    const skip = (page - 1) * limit;
    const take = limit;
    let total = 0;
    let articles = [];
    let error = false;
    let errorMessage = "";

    try {
        total = await prisma.newsArticle.count({
            where: {
                deleted: false,
                ...filterByStatus && { status: <ArticleStatus>articleStatus },
                ...filterByTopic && {
                    topics: {
                        some: {
                            id: topicID
                        }
                    }
                }
            }
        });
        articles = await prisma.newsArticle.findMany({
            skip: skip,
            take: take,
            where: {
                deleted: false,
                ...filterByStatus && { status: <ArticleStatus>articleStatus },
                ...filterByTopic && {
                    topics: {
                        some: {
                            id: topicID
                        }
                    }
                }
            },
            include: {
                topics: true
            },
            orderBy: {
                createdOn: 'desc'
            }
        });
    } catch (err) {
        error = true;
        errorMessage = "Unable to fetch data";
    }
    const response = {
        count: total,
        data: articles,
        total_pages: total != 0 ? Math.ceil(total / limit) : 0,
        page: page,
        limit: limit,
        error: error,
        error_message: errorMessage
    };
    return response;
}

const getSingleArticle = async function (articleID: number): Promise<ResponseFormatArray> {
    let article = null;
    let error = false;
    let errorMessage = "";
    try {
        article = await prisma.newsArticle.findFirst({
            where: { id: articleID, deleted: false }
        });
    } catch (err) {
        error = true;
        errorMessage = "Unable to fetch article";
    }
    const response = {
        count: article ? 1 : 0,
        data: article,
        total_pages: article ? 1 : 0,
        page: 1,
        limit: 1,
        error: false,
        error_message: ""
    };
    return response;
}

const createArticle = async function (newTitle: string, newContent: string, newStatus: string, newTopics: { id: number }[] ): Promise<ResponseFormatArray> {
    let article = null;
    let error = false;
    let errorMessage = "";

    let statusValid = false;
    if (newStatus == ArticleStatus.deleted || newStatus == ArticleStatus.draft || newStatus == ArticleStatus.published) {
        statusValid = true
    }
    if (!statusValid) {
        const response = {
            count: article ? 1 : 0,
            data: article,
            total_pages: article ? 1 : 0,
            page: 1,
            limit: 1,
            error: false,
            error_message: "Please select a valid status."
        };
        return response;
    }

    try {
        article = await prisma.newsArticle.create({
            data: {
                title: newTitle,
                content: newContent,
                status: <ArticleStatus>newStatus,
                topics: {
                    connect: newTopics.map(topic => { return { id: topic.id } })
                }
            },
            include: {
                topics: true
            }
        })
    } catch (err) {
        error = true;
        errorMessage = "Unable to create article";
    }

    const response = {
        count: article ? 1 : 0,
        data: article,
        total_pages: article ? 1 : 0,
        page: 1,
        limit: 1,
        error: false,
        error_message: ""
    };
    return response;
}

const updateArticle = async function (articleID: number, newTitle: string, newContent: string, newStatus: string, newTopics: { id: number }[] ): Promise<ResponseFormatArray> {
    let article = null;
    let error = false;
    let errorMessage = "";

    let statusValid = false;
    if (newStatus == ArticleStatus.deleted || newStatus == ArticleStatus.draft || newStatus == ArticleStatus.published) {
        statusValid = true
    }
    if (!statusValid) {
        const response = {
            count: article ? 1 : 0,
            data: article,
            total_pages: article ? 1 : 0,
            page: 1,
            limit: 1,
            error: false,
            error_message: "Please select a valid status."
        };
        return response;
    }
    
    try {
        const existingArticle = await prisma.newsArticle.findFirst({
            where: { id: articleID },
            include: {
                topics: true
            }
        })

        article = await prisma.newsArticle.update({
            where: { id: articleID },
            data: {
                topics: {
                    disconnect: existingArticle.topics.map(topic => { return { id: topic.id } })
                }
            }
        })
        article = await prisma.newsArticle.update({
            where: { id: articleID },
            data: {
                title: newTitle,
                content: newContent,
                status: <ArticleStatus>newStatus,
                topics: {
                    connect: newTopics.map(topic => { return { id: topic.id } })
                }
            },
            include: {
                topics: true
            }
        })
    } catch (err) {
        error = true;
        errorMessage = "Unable to update article";
    }

    const response = {
        count: article ? 1 : 0,
        data: article,
        total_pages: article ? 1 : 0,
        page: 1,
        limit: 1,
        error: false,
        error_message: ""
    };
    return response;
}

const deleteArticle = async function (articleID: number): Promise<ResponseFormatArray> {
    let error = false;
    let errorMessage = "";

    try {
        await prisma.newsArticle.delete({
            where: { id: articleID }
        });
    } catch (err) {
        error = true;
        errorMessage = "Unable to delete article";
    }

    const response = {
        count: 0,
        data: null,
        total_pages: 0,
        page: 1,
        limit: 1,
        error: false,
        error_message: ""
    };
    return response;
}

export { getArticles, getSingleArticle, createArticle, updateArticle, deleteArticle }