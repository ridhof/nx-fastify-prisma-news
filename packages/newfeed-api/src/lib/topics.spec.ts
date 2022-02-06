import { getTopics, createTopic, updateTopic, deleteTopic, getSingleTopic } from './topics';

describe('get topics', () => {
    it('should has valid format', async () => {
      const page = 1;
      const limit = 10;
      const topics = await getTopics(page, limit);
      expect(topics.limit).toEqual(limit);
      expect(topics.page).toEqual(page);
      expect(topics.error).toEqual(false);
      expect(topics.data.length).toBeGreaterThanOrEqual(0);
    })
});

describe('create topic', () => {
  it('should has return created topic', async () => {
    const page = 1;
    const limit = 1;
    const oldTopics = await getTopics(page, limit);
    const oldCount = oldTopics.count;

    const topicName = "Testing";
    const topic = await createTopic(topicName);
    expect(topic.error).toEqual(false)
    expect(topic.data.name).toEqual(topicName);

    const newTopics = await getTopics(page, limit);
    expect(newTopics.count).toEqual(oldCount + 1);
  })
});

describe('update topic', () => {
  it('should has return updated topic', async () => {
    const topicName = "Testing";
    const topic = await createTopic(topicName);
    expect(topic.error).toEqual(false)
    expect(topic.data.name).toEqual(topicName);

    const newTopicName = "Testing 2";
    const updatedTopic = await updateTopic(topic.data.id, newTopicName);
    expect(updatedTopic.data.name).toEqual(newTopicName);
  })
});

describe('delete topic', () => {
  it('should has delete topic and return null with deleted topic id', async () => {
    const topicName = "Testing";
    const topic = await createTopic(topicName);

    const deletedTopic = await deleteTopic(topic.data.id);
    expect(deletedTopic.error).toEqual(false);

    const getDeletedTopic = await getSingleTopic(topic.data.id);
    expect(getDeletedTopic.data).toEqual(null);
  })
});
