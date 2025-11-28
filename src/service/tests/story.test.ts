import { describe, it, expect, beforeEach, vi } from 'vitest';

import StoryAPI from '../story';

const mockRequest = vi.fn();

class MockFetcher extends StoryAPI {
  request = mockRequest;
}

describe('StoryAPI', () => {
  let api: MockFetcher;

  beforeEach(() => {
    api = new MockFetcher();
    mockRequest.mockReset();
  });

  it('calls start with correct params', async () => {
    const mockResponse = { story: { id: '1', name: 'Test' }, task_id: 'task1' };
    mockRequest.mockResolvedValue(mockResponse);

    const topic_id = 'topic1';
    const settings: StorySettingSelector = 'account';
    const mode: PlayMode = 'play_limited';
    const result = await api.start(topic_id, settings, mode);

    expect(api.request).toHaveBeenCalledWith('/story/start', {
      method: 'POST',
      body: JSON.stringify({ topic_id, settings, mode }),
    });
    expect(result).toBe(mockResponse);
  });

  it('calls demo with correct topic id', async () => {
    const mockResponse = { story: { id: 'demo' }, task_id: 'demo-task' };
    mockRequest.mockResolvedValue(mockResponse);

    const result = await api.demo('topic-demo');

    expect(api.request).toHaveBeenCalledWith('/story/demo/topic-demo');
    expect(result).toBe(mockResponse);
  });

  it('calls delete with correct params', async () => {
    const mockResponse = { success: true };
    mockRequest.mockResolvedValue(mockResponse);

    const story_id = 'story1';
    const result = await api.delete(story_id);

    expect(api.request).toHaveBeenCalledWith('/story/story1', {
      method: 'DELETE',
    });
    expect(result).toBe(mockResponse);
  });

  it('calls restoreCredit with correct params', async () => {
    const mockResponse = { credit: 1 };
    mockRequest.mockResolvedValue(mockResponse);

    const result = await api.restoreCredit();

    expect(api.request).toHaveBeenCalledWith('/story/credit-restore');
    expect(result).toBe(mockResponse);
  });

  it('calls continue with correct params', async () => {
    const mockResponse = {
      story: { id: '2', name: 'Continue' },
      task_id: 'task2',
    };
    mockRequest.mockResolvedValue(mockResponse);

    const story_id = 'story2';
    const result = await api.continue(story_id);

    expect(api.request).toHaveBeenCalledWith('/story/continue', {
      method: 'POST',
      body: JSON.stringify({ story_id }),
    });
    expect(result).toBe(mockResponse);
  });

  it('calls respond with correct params', async () => {
    const mockResponse = {
      story: { id: '3', name: 'Respond' },
      task_id: 'task3',
    };
    mockRequest.mockResolvedValue(mockResponse);

    const story_id = 'story3';
    const choice = 1;
    const result = await api.respond(story_id, choice);

    expect(api.request).toHaveBeenCalledWith('/story/respond', {
      method: 'POST',
      body: JSON.stringify({ story_id, choice }),
    });
    expect(result).toBe(mockResponse);
  });

  it('calls tts with correct params and blob response type', async () => {
    const mockBlob = new Blob(['audio']);
    mockRequest.mockResolvedValue(mockBlob);

    const story_id = 'story4';
    const result = await api.tts(story_id);

    expect(api.request).toHaveBeenCalledWith(
      '/story/tts',
      {
        method: 'POST',
        body: JSON.stringify({ story_id }),
      },
      'blob',
    );
    expect(result).toBe(mockBlob);
  });

  it('calls step with correct params', async () => {
    const mockResponse = { story: { id: '4', name: 'Step' }, task_id: 'task4' };
    mockRequest.mockResolvedValue(mockResponse);

    const story_id = 'story4';
    const step = 1;
    const result = await api.step(story_id, step);

    expect(api.request).toHaveBeenCalledWith('/story/step', {
      method: 'POST',
      body: JSON.stringify({ story_id, step }),
    });
    expect(result).toBe(mockResponse);
  });

  it('calls imageStatus with correct params', async () => {
    const mockResponse = { status: 'pending' };
    mockRequest.mockResolvedValue(mockResponse);

    const story_id = 'story5';
    const task_id = 'task5';
    const result = await api.imageStatus(story_id, task_id);

    expect(api.request).toHaveBeenCalledWith('/story/image-status', {
      method: 'POST',
      body: JSON.stringify({ story_id, task_id }),
    });
    expect(result).toBe(mockResponse);
  });
});
