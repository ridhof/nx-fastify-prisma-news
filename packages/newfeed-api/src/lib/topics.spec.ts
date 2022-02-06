import { getTopics } from './topics';

describe('topicBackend', () => {
  it('should work', async () => {
    const topics = await getTopics(1, 10);
    expect(topics.data.length).toEqual(10);
  });
});
