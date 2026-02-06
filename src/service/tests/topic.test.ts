import { describe, it, expect, beforeEach, vi } from 'vitest';

import TopicAPI from '../topic';

const mockRequest = vi.fn();

class MockTopicAPI extends TopicAPI {
  request = mockRequest;
}

describe('TopicAPI', () => {
  let api: MockTopicAPI;

  beforeEach(() => {
    api = new MockTopicAPI();
    mockRequest.mockReset();
  });

  it('creates and submits topics', async () => {
    const payload = { name: 'Topic' } as any;
    await api.new(payload);
    expect(mockRequest).toHaveBeenCalledWith('/topic/new', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    mockRequest.mockClear();
    await api.submit('topic-1');
    expect(mockRequest).toHaveBeenCalledWith('/govern/submit-topic/topic-1');
  });

  it('deletes topics with payload', async () => {
    await api.delete('topic-1');
    expect(mockRequest).toHaveBeenCalledWith('/topic/delete', {
      method: 'DELETE',
      body: JSON.stringify({ topic_id: 'topic-1' }),
    });
  });

  it('fetches collection listings', async () => {
    await api.sectionCollection(2, 25, true);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/sections?page=2&page_size=25&refresh=true',
    );

    mockRequest.mockClear();
    await api.creatorCollection(3, 12, false);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/creators?page=3&page_size=12&refresh=false',
    );

    mockRequest.mockClear();
    await api.sectionCategoryCollection('section-1', 4, 10, true);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/sections/section-1/categories?page=4&page_size=10&refresh=true',
    );

    mockRequest.mockClear();
    await api.creatorCategoryCollection('creator-1', 5, 8, false);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/creators/creator-1/categories?page=5&page_size=8&refresh=false',
    );

    mockRequest.mockClear();
    await api.topicCollection('category-1', 6, 9, true);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/categories/category-1/topics?page=6&page_size=9&refresh=true',
    );
  });

  it('fetches topic manager data', async () => {
    await api.topicManager('topic-1');
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/manager/topic-1?refresh=false',
    );

    mockRequest.mockClear();
    await api.topicManager('topic-1', true);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/manager/topic-1?refresh=true',
    );
  });

  it('manages categories on topics', async () => {
    await api.addCategory('topic-1', 'cat-1', 3);
    expect(mockRequest).toHaveBeenCalledWith('/topic/add-category', {
      method: 'PATCH',
      body: JSON.stringify({
        topic_id: 'topic-1',
        category_id: 'cat-1',
        sort_order: 3,
      }),
    });

    mockRequest.mockClear();
    await api.changeTopicSortOrder('topic-1', 'cat-1', 4);
    expect(mockRequest).toHaveBeenCalledWith('/topic/change-sortorder', {
      method: 'PATCH',
      body: JSON.stringify({
        topic_id: 'topic-1',
        category_id: 'cat-1',
        sort_order: 4,
      }),
    });

    mockRequest.mockClear();
    await api.removeCategory('topic-1', 'cat-1');
    expect(mockRequest).toHaveBeenCalledWith('/topic/remove-category', {
      method: 'PATCH',
      body: JSON.stringify({
        topic_id: 'topic-1',
        category_id: 'cat-1',
      }),
    });
  });

  it('manages genres on topics', async () => {
    await api.addGenre('topic-1', 'genre-1');
    expect(mockRequest).toHaveBeenCalledWith('/topic/add-genre', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id: 'topic-1', genre_id: 'genre-1' }),
    });

    mockRequest.mockClear();
    await api.removeGenre('topic-1', 'genre-1');
    expect(mockRequest).toHaveBeenCalledWith('/topic/remove-genre', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id: 'topic-1', genre_id: 'genre-1' }),
    });
  });

  it('manages gates on topics', async () => {
    await api.addGate('topic-1', 'gate-1');
    expect(mockRequest).toHaveBeenCalledWith('/topic/add-gate', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id: 'topic-1', gate_id: 'gate-1' }),
    });

    mockRequest.mockClear();
    await api.removeGate('topic-1', 'gate-1');
    expect(mockRequest).toHaveBeenCalledWith('/topic/remove-gate', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id: 'topic-1', gate_id: 'gate-1' }),
    });
  });

  it('updates topic metadata fields', async () => {
    await api.changeName('topic-1', 'New name');
    expect(mockRequest).toHaveBeenCalledWith('/topic/change-name', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id: 'topic-1', new_name: 'New name' }),
    });

    mockRequest.mockClear();
    await api.changeDescription('topic-1', 'New description');
    expect(mockRequest).toHaveBeenCalledWith('/topic/change-description', {
      method: 'PATCH',
      body: JSON.stringify({
        topic_id: 'topic-1',
        new_description: 'New description',
      }),
    });

    mockRequest.mockClear();
    await api.changeAvailability('topic-1', true);
    expect(mockRequest).toHaveBeenCalledWith('/topic/change-availability', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id: 'topic-1', availability: true }),
    });

    mockRequest.mockClear();
    await api.changeVisibility('topic-1', 'public');
    expect(mockRequest).toHaveBeenCalledWith('/topic/change-visibility', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id: 'topic-1', visibility: 'public' }),
    });
  });

  it('edits prompts and settings', async () => {
    await api.editPrompt('topic-1', { premise: 'Prompt' });
    expect(mockRequest).toHaveBeenCalledWith('/topic/edit-prompt', {
      method: 'PATCH',
      body: JSON.stringify({
        topic_id: 'topic-1',
        new_prompt: { premise: 'Prompt' },
      }),
    });

    mockRequest.mockClear();
    await api.editImagePrompt('topic-1', 'Image prompt');
    expect(mockRequest).toHaveBeenCalledWith('/topic/edit-image-prompt', {
      method: 'PATCH',
      body: JSON.stringify({
        topic_id: 'topic-1',
        new_image_prompt: 'Image prompt',
      }),
    });

    mockRequest.mockClear();
    const settings = { language: 'en' } as any;
    await api.editPromptSettings('topic-1', settings);
    expect(mockRequest).toHaveBeenCalledWith('/topic/edit-prompt-settings', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id: 'topic-1', settings }),
    });
  });

  it('uploads and deletes media files', async () => {
    const file = new File(['image'], 'image.png');
    await api.uploadFile('topic-1', 'cover' as any, file);
    const [uploadUrl, uploadOptions] = mockRequest.mock.calls[0];
    expect(uploadUrl).toBe('/topic/upload-media');
    expect(uploadOptions.method).toBe('POST');
    expect(uploadOptions.body).toBeInstanceOf(FormData);

    mockRequest.mockClear();
    await api.deleteMediaFile('topic-1', 'file-1', 'cover' as any);
    expect(mockRequest).toHaveBeenCalledWith('/topic/delete-media', {
      method: 'DELETE',
      body: JSON.stringify({
        topic_id: 'topic-1',
        file_id: 'file-1',
        media_type: 'cover',
      }),
    });
  });

  it('handles draft lifecycle', async () => {
    const draft = { title: 'Draft' } as any;
    await api.newDraft(draft);
    expect(mockRequest).toHaveBeenCalledWith('/topic/drafts', {
      method: 'POST',
      body: JSON.stringify(draft),
    });

    mockRequest.mockClear();
    const file = new File(['doc'], 'doc.txt');
    await api.draftDocument(file, 'cat-1');
    const [draftUrl, draftOptions] = mockRequest.mock.calls[0];
    expect(draftUrl).toBe('/topic/drafts/draft-document');
    expect(draftOptions.method).toBe('POST');
    expect(draftOptions.body).toBeInstanceOf(FormData);

    mockRequest.mockClear();
    await api.getDraft('draft-1');
    expect(mockRequest).toHaveBeenCalledWith('/topic/drafts/draft-1', {
      method: 'GET',
    });

    mockRequest.mockClear();
    await api.getDrafts();
    expect(mockRequest).toHaveBeenCalledWith('/topic/drafts', {
      method: 'GET',
    });

    mockRequest.mockClear();
    await api.searchDrafts('query', 2, 10);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/drafts/search?query=query&page=2&page_size=10',
    );

    mockRequest.mockClear();
    await api.updateDraft('draft-1', draft);
    expect(mockRequest).toHaveBeenCalledWith('/topic/drafts/draft-1', {
      method: 'PUT',
      body: JSON.stringify(draft),
    });

    mockRequest.mockClear();
    await api.deleteDraft('draft-1');
    expect(mockRequest).toHaveBeenCalledWith('/topic/drafts/draft-1', {
      method: 'DELETE',
    });
  });
});
