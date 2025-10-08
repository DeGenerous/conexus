import { v4 as uuid } from 'uuid';
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

const SCHEMA_VERSION = 1; // bump when shape changes

const shortenID = (id: string) => id.split('-')[0];

const Drafts = {
  async create(): Promise<string | null> {
    clearAllData();

    const when = new Date();
    const draft: DraftPayload = {
      id: uuid(),
      title: 'Untitled',
      created_at: when,
      updated_at: when,
      ...collectState(),
    };

    const id = await topic.saveNewTopicDraft(draft);
    console.log('new-draft-id: ', id);
    SetCache(CURRENT_DRAFT_KEY, id);

    currentDraft.set(draft);
    toastStore.show(
      `You just began a new dream. Draft created: ${shortenID(id!)} (${draft.title})`,
    );
    return id;
  },

  async save(id?: string): Promise<void> {
    if (typeof window === 'undefined') return;

    id ||= GetCache(CURRENT_DRAFT_KEY) || await this.create();
    const draft = await topic.getDraft(id!);
    if (!draft || !id) return toastStore.show(`Save unknown draft`, 'error');

    // draft.data = collectState();
    if (draft.story_data.name) draft.title = draft.story_data.name;

    await topic.updateDraft(id, draft);
    currentDraft.set(draft);
    toastStore.show(`Draft saved: ${shortenID(id as string)} (${draft.title})`);
  },

  async restore(id: string): Promise<void> {
    const draft = await topic.getDraft(id);
    if (!draft) return toastStore.show('Draft not found', 'error');

    // applyState(draft.data);
    SetCache(CURRENT_DRAFT_KEY, id);

    currentDraft.set(draft);
    toastStore.show('Draft restored - you’re back where you left off');
  },
  
  delete(id: string) {
    if (GetCache(CURRENT_DRAFT_KEY) === id) ClearCache(CURRENT_DRAFT_KEY);

    toastStore.show(`Draft deleted: ${shortenID(id)}`);
  },
};

export default Drafts;
