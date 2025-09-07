import { describe, it, expect, beforeEach, vi } from 'vitest';

import TopicAPI from '../topic';

const mockRequest = vi.fn();

class MockFetcher extends TopicAPI {
  request = mockRequest;
}

describe('TopicAPI', () => {
  let api: MockFetcher;

  beforeEach(() => {
    api = new MockFetcher();
    mockRequest.mockClear();
  });

  it('should create a new topic', async () => {
    mockRequest.mockResolvedValue('topic123');
    const req: TopicRequest = {
      name: 'Test Topic',
      description: 'Test Description',
      category_id: 'cat1',
      available: true,
      visibility: 'public',
      prompt: 'Test prompt',
      image_prompt: 'Test image prompt',
      settings: {
        imageStyle: 'default',
        language: 'en',
        interactivity: 'min',
        difficulty: 'min',
        length: 'min',
        readingStyle: 'normal',
        kidsMode: 'no',
      },
    };
    const result = await api.new(req);
    expect(api.request).toHaveBeenCalledWith('/topic/new', {
      method: 'POST',
      body: JSON.stringify(req),
    });
    expect(result).toBe('topic123');
  });

  it('should get topic manager data', async () => {
    const manager: TopicManager = {
      Topic: {
        id: '1',
        name: 'Test Topic',
        description: 'Test Description',
        available: true,
        visibility: 'public',
        media_folder_id: 'folder1',
      },
      TopicPrompt: {
        id: 'tp1',
        prompt: 'Test prompt',
        image_prompt: 'Test image prompt',
      },
      TopicPromptSettings: {
        imageStyle: 'default',
        language: 'en',
        interactivity: 'min',
        difficulty: 'min',
        length: 'min',
        readingStyle: 'normal',
        kidsMode: 'no',
      },
      Categories: [],
      Genres: [],
      Gates: [],
      MediaFiles: [],
    };
    mockRequest.mockResolvedValue(manager);
    const result = await api.topicManager('1');
    expect(api.request).toHaveBeenCalledWith('/topic/manager/1');
    expect(result).toEqual(manager);
  });

  it('should add a category to a topic', async () => {
    mockRequest.mockResolvedValue({});
    await api.addCategory('t1', 'c1', 2);
    expect(api.request).toHaveBeenCalledWith('/topic/add-category', {
      method: 'PATCH',
      body: JSON.stringify({
        topic_id: 't1',
        category_id: 'c1',
        sort_order: 2,
      }),
    });
  });

  it('should change category sort order', async () => {
    await api.changeCategorySortOrder('t1', 'c1', 3);
    expect(api.request).toHaveBeenCalledWith('/topic/change-sortorder', {
      method: 'PATCH',
      body: JSON.stringify({
        topic_id: 't1',
        category_id: 'c1',
        sort_order: 3,
      }),
    });
  });

  it('should remove a category from a topic', async () => {
    await api.removeCategory('t1', 'c1');
    expect(api.request).toHaveBeenCalledWith('/topic/remove-category', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id: 't1', category_id: 'c1' }),
    });
  });

  it('should add a genre to a topic', async () => {
    await api.addGenre('t1', 'g1');
    expect(api.request).toHaveBeenCalledWith('/topic/add-genre', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id: 't1', genre_id: 'g1' }),
    });
  });

  it('should remove a genre from a topic', async () => {
    await api.removeGenre('t1', 'g1');
    expect(api.request).toHaveBeenCalledWith('/topic/remove-genre', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id: 't1', genre_id: 'g1' }),
    });
  });

  it('should add a gate to a topic', async () => {
    await api.addGate('t1', 'g1');
    expect(api.request).toHaveBeenCalledWith('/topic/add-gate', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id: 't1', gate_id: 'g1' }),
    });
  });

  it('should remove a gate from a topic', async () => {
    await api.removeGate('t1', 'g1');
    expect(api.request).toHaveBeenCalledWith('/topic/remove-gate', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id: 't1', gate_id: 'g1' }),
    });
  });

  it('should upload a file to a topic', async () => {
    const file = new File(['content'], 'test.png');
    mockRequest.mockResolvedValue(['file1']);
    const result = await api.uploadFile('tp1', 'tile', file);
    expect(api.request).toHaveBeenCalledWith(
      '/topic/upload-media',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      }),
    );
    expect(result).toEqual(['file1']);
  });

  it('should delete a media file from a topic', async () => {
    await api.deleteMediaFile('tp1', 'file1', 'tile');
    expect(api.request).toHaveBeenCalledWith('/topic/delete-media', {
      method: 'DELETE',
      body: JSON.stringify({
        topic_id: 'tp1',
        file_id: 'file1',
        media_type: 'tile',
      }),
    });
  });

  it('should create a new draft', async () => {
    const draft: DraftPayload = {
      title: 'Draft',
      data: {
        storyData: {} as StoryData,
        promptSettings: {} as PromptSettings,
        openPrompt: '',
        tablePrompt: {} as TablePrompt,
      }, // Provide appropriate mock data as per your DraftPayload type
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockRequest.mockResolvedValue('draft1');
    const result = await api.newDraft(draft);
    expect(api.request).toHaveBeenCalledWith('/topic/drafts', {
      method: 'POST',
      body: JSON.stringify(draft),
    });
    expect(result).toBe('draft1');
  });

  it('should get a draft by ID', async () => {
    const draft: DraftPayload = {
      id: 'd1',
      title: 'Draft',
      data: {
        storyData: {} as StoryData,
        promptSettings: {} as PromptSettings,
        openPrompt: '',
        tablePrompt: {} as TablePrompt,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockRequest.mockResolvedValue(draft);
    const result = await api.getDraft('d1');
    expect(api.request).toHaveBeenCalledWith('/topic/drafts/d1', {
      method: 'GET',
    });
    expect(result).toEqual(draft);
  });

  it('should get all drafts', async () => {
    const drafts: DraftPayload[] = [
      {
        id: 'd1',
        title: 'Draft',
        data: {
          storyData: {} as StoryData,
          promptSettings: {} as PromptSettings,
          openPrompt: '',
          tablePrompt: {} as TablePrompt,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    mockRequest.mockResolvedValue(drafts);
    const result = await api.getDrafts();
    expect(api.request).toHaveBeenCalledWith('/topic/drafts', {
      method: 'GET',
    });
    expect(result).toEqual(drafts);
  });

  it('should search drafts', async () => {
    const drafts: DraftPayload[] = [
      {
        id: 'd1',
        title: 'Draft',
        data: {
          storyData: {} as StoryData,
          promptSettings: {} as PromptSettings,
          openPrompt: '',
          tablePrompt: {} as TablePrompt,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    mockRequest.mockResolvedValue(drafts);
    const result = await api.searchDrafts('test', 1, 10);
    expect(api.request).toHaveBeenCalledWith(
      '/topic/drafts/search?query=test&page=1&page_size=10',
    );
    expect(result).toEqual(drafts);
  });

  it('should update a draft by ID', async () => {
    const draft: DraftPayload = {
      title: 'Updated',
      data: {
        storyData: {} as StoryData,
        promptSettings: {} as PromptSettings,
        openPrompt: '',
        tablePrompt: {} as TablePrompt,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await api.updateDraft('d1', draft);
    expect(api.request).toHaveBeenCalledWith('/topic/drafts/d1', {
      method: 'PUT',
      body: JSON.stringify(draft),
    });
  });

  it('should delete a draft by ID', async () => {
    await api.deleteDraft('d1');
    expect(api.request).toHaveBeenCalledWith('/topic/drafts/d1', {
      method: 'DELETE',
    });
  });
});
