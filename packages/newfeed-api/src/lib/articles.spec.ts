import { getArticles, createArticle, updateArticle, deleteArticle, getSingleArticle } from './articles';

describe('get articles', () => {
    it('should has valid format', async () => {
      const page = 1;
      const limit = 10;
      const filterByTopic = false;
      const filterByStatus = false;
      const topicID = null;
      const status = null;
      const topics = await getArticles(page, limit, filterByTopic, topicID, filterByStatus, status);
      expect(topics.limit).toEqual(limit);
      expect(topics.page).toEqual(page);
      expect(topics.error).toEqual(false);
      expect(topics.data.length).toBeGreaterThanOrEqual(0);
    })
});

describe('create articles', () => {
  it('should has return created article', async () => {
    const page = 1;
    const limit = 1;
    const filterByTopic = false;
    const filterByStatus = false;
    const topicID = null;
    const status = null;
    const oldArticles = await getArticles(page, limit, filterByTopic, topicID, filterByStatus, status);
    const oldCount = oldArticles.count;

    const newTitle = "Testing Title";
    const newContent = "Testing Content";
    const newStatus = "draft";
    const newTopics = [{ id: 1 }];

    const article = await createArticle(newTitle, newContent, newStatus, newTopics);
    expect(article.error).toEqual(false);
    expect(article.data.title).toEqual(newTitle);
    expect(article.data.content).toEqual(newContent);
    expect(article.data.status).toEqual(newStatus);

    const newArticles = await getArticles(page, limit, filterByTopic, topicID, filterByStatus, status);
    expect(newArticles.count).toEqual(oldCount + 1);
  })
});

describe('update article', () => {
  it('should has return updated article', async () => {
    const newTitle = "Testing Title";
    const newContent = "Testing Content";
    const newStatus = "draft";
    const newTopics = [{ id: 1 }];

    const article = await createArticle(newTitle, newContent, newStatus, newTopics);
    expect(article.error).toEqual(false);
    expect(article.data.title).toEqual(newTitle);
    expect(article.data.content).toEqual(newContent);
    expect(article.data.status).toEqual(newStatus);

    const updateTitle = "Testing Title 2";
    const updateContent = "Testing Content 2";
    const updateStatus = "published";
    const updateTopics = [{id: 2}];
    const updatedArticle = await updateArticle(article.data.id, updateTitle, updateContent, updateStatus, updateTopics);
    expect(updatedArticle.data.title).toEqual(updateTitle);
    expect(updatedArticle.data.content).toEqual(updateContent);
    expect(updatedArticle.data.status).toEqual(updateStatus);
  })
});

describe('delete article', () => {
  it('should has delete article and return null with deleted article id', async () => {
    const newTitle = "Testing Title";
    const newContent = "Testing Content";
    const newStatus = "draft";
    const newTopics = [{ id: 1 }];

    const article = await createArticle(newTitle, newContent, newStatus, newTopics);
    expect(article.error).toEqual(false);

    const deletedArticle = await deleteArticle(article.data.id);
    expect(deletedArticle.error).toEqual(false);

    const getDeletedArticle = await getSingleArticle(article.data.id);
    console.log(getDeletedArticle)
    expect(getDeletedArticle.data).toEqual(null);
  })
});
