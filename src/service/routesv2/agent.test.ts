import AgentAPI from './agent';

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

const mockRequest = vi.fn();

class MockFetcher extends AgentAPI {
    request = mockRequest;
}

describe('AgentAPI', () => {
    let api: MockFetcher;

    beforeEach(() => {
        api = new MockFetcher();
        mockRequest.mockReset();
    });

    it('calls start with correct params', async () => {
        const topic_id = 'topic123';
        const settings = 'topic';
        const mockData = { id: 'story1' };
        (mockRequest).mockResolvedValue(mockData);

        const result = await api.start(topic_id, settings);

        expect(api.request).toHaveBeenCalledWith(
            '/agent/story/start',
            {
                method: 'POST',
                body: JSON.stringify({ topic_id, settings }),
            }
        );
        expect(result).toBe(mockData);
    });

    it('calls delete with correct params', async () => {
        const story_id = 'story123';
        (mockRequest).mockResolvedValue('deleted');

        const result = await api.delete(story_id);

        expect(api.request).toHaveBeenCalledWith(
            '/agent/story/story123',
            { method: 'DELETE' }
        );
        expect(result).toBe('deleted');
    });

    it('calls respond with correct params', async () => {
        const story_id = 'story123';
        const choice = 2;
        const mockData = { id: 'story123', choice };
        (mockRequest).mockResolvedValue(mockData);

        const result = await api.respond(story_id, choice);

        expect(api.request).toHaveBeenCalledWith(
            '/agent/story/respond',
            {
                method: 'POST',
                body: JSON.stringify({ story_id, choice }),
            }
        );
        expect(result).toBe(mockData);
    });

    it('calls tts with correct params', async () => {
        const story_id = 'story123';
        const mockBlob = new Blob(['audio']);
        (mockRequest).mockResolvedValue(mockBlob);

        const result = await api.tts(story_id);

        expect(api.request).toHaveBeenCalledWith(
            '/agent/story/tts',
            {
                method: 'POST',
                body: JSON.stringify({ story_id }),
            },
            'blob'
        );
        expect(result).toBe(mockBlob);
    });

    it('calls step with correct params', async () => {
        const story_id = 'story123';
        const step_id = 'step456';
        const mockData = { step: 'data' };
        (mockRequest).mockResolvedValue(mockData);

        const result = await api.step(story_id, step_id);

        expect(api.request).toHaveBeenCalledWith(
            '/agent/story/step',
            {
                method: 'POST',
                body: JSON.stringify({ story_id, step_id }),
            }
        );
        expect(result).toBe(mockData);
    });

    it('calls stepImage with correct params', async () => {
        const story_id = 'story123';
        const step_id = 'step456';
        const mockData = { image: 'img', type: 'cover' };
        (mockRequest).mockResolvedValue(mockData);

        const result = await api.stepImage(story_id, step_id);

        expect(api.request).toHaveBeenCalledWith(
            '/agent/story/step/image',
            {
                method: 'POST',
                body: JSON.stringify({ story_id, step_id }),
            }
        );
        expect(result).toBe(mockData);
    });

    it('calls generateImage with correct params', async () => {
        const story_id = 'story123';
        const mockData = 'base64string';
        (mockRequest).mockResolvedValue(mockData);

        const result = await api.generateImage(story_id);

        expect(api.request).toHaveBeenCalledWith(
            '/agent/story/generate-image',
            {
                method: 'POST',
                body: JSON.stringify({ story_id }),
            }
        );
        expect(result).toBe(mockData);
    });

    it('calls imageStatus with correct params', async () => {
        const story_id = 'story123';
        const task_id = 'task789';
        const mockData = 'base64string';
        (mockRequest).mockResolvedValue(mockData);

        const result = await api.imageStatus(story_id, task_id);

        expect(api.request).toHaveBeenCalledWith(
            '/agent/story/image-status',
            {
                method: 'POST',
                body: JSON.stringify({ story_id, task_id }),
            }
        );
        expect(result).toBe(mockData);
    });
});