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

const createArticle = async function (newTitle: string, newContent: string, newStatus: ArticleStatus, newTopics: Topic[] ): Promise<NewsArticle> {
    const article = await prisma.newsArticle.create({
        data: {
            title: newTitle,
            content: newContent,
            status: newStatus,
            topics: {
                connect: newTopics.map(topic => { return { id: topic.id } })
            }
        }
    })
    return article
}

const updateArticle = async function (articleID: number, newTitle: string, newContent: string, newStatus: ArticleStatus ): Promise<NewsArticle> {
    const article = await prisma.newsArticle.update({
        where: { id: articleID },
        data: {
            title: newTitle,
            content: newContent,
            status: newStatus  
        }
    })
    return article
}

export { getArticles, getSingleArticle, createArticle, updateArticle }