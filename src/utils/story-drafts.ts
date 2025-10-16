import Topic from '@lib/topics';
import {
  clearAllData,
  currentDraft,
  collectState,
  applyState,
} from '@stores/dream.svelte';
import { toastStore } from '@stores/toast.svelte';
import {
  GetCache,
  SetCache,
  ClearCache,
  CURRENT_DRAFT_KEY,
} from '@constants/cache';

let topic: Topic = new Topic();

const shortenID = (id: string) => id?.split('-')[0];

const Drafts = {
  async create(): Promise<string | null> {
    clearAllData();

    const draftData = collectState();

    const draft: DraftPayload = {
      title: draftData.story_data.name || 'Untitled',
      ...draftData,
    };

    const id = await topic.saveNewTopicDraft(draft);
    if (!id) {
      toastStore.show('Failed to create draft', 'error');
      return null;
    }
    draft.id = id;
    SetCache(CURRENT_DRAFT_KEY, id);

    currentDraft.set(draft);

    toastStore.show(
      `You just began a new dream. Draft created: ${shortenID(id!)}`,
    );
    return id;
  },

  async save(id?: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    id ||= GetCache(CURRENT_DRAFT_KEY) || (await this.create());
    const draft = await topic.getDraft(id!);
    if (!draft || !id) {
      toastStore.show(`Save unknown draft`, 'error');
      return;
    }

    const draftData = collectState();

    draft.story_data = draftData.story_data;
    draft.prompt_settings = draftData.prompt_settings;
    draft.open_prompt = draftData.open_prompt;
    draft.table_prompt = draftData.table_prompt;
    draft.title = draft.story_data.name || 'Untitled';

    currentDraft.set(draft);

    await topic.updateDraft(id, draft);

    // toastStore.show(`Draft saved: ${shortenID(id as string)} (${draft.title})`);
  },

  async restore(id: string): Promise<void> {
    const draft = await topic.getDraft(id);
    if (!draft) {
      toastStore.show('Draft not found', 'error');
      return;
    }

    SetCache(CURRENT_DRAFT_KEY, id);
    applyState(draft);

    currentDraft.set(draft);

    toastStore.show(
      `Draft ${shortenID(id as string)} restored - you’re back where you left off`,
    );
  },

  async delete(id: string) {
    if (GetCache(CURRENT_DRAFT_KEY) === id) ClearCache(CURRENT_DRAFT_KEY);

    await topic.deleteDraft(id);

    // toastStore.show(`Draft deleted: ${shortenID(id)}`);
  },
};

export default Drafts;
