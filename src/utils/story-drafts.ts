import { v4 as uuid } from 'uuid';
import { collectState, applyState } from '@stores/dream.svelte';
import { toastStore } from '@stores/toast.svelte';
import {
  GetCache,
  SetCache,
  ClearCache,
  DRAFTS_INDEX_KEY,
  DRAFT_KEY,
  CURRENT_DRAFT_KEY,
} from '@constants/cache';

function readIndex(): DraftIndexEntry[] {
  return GetCache(DRAFTS_INDEX_KEY) || [];
}

function writeIndex(list: DraftIndexEntry[]) {
  SetCache(DRAFTS_INDEX_KEY, list);
}

const Drafts = {
  create(): string {
    const id = uuid();
    const when = Date.now();
    const draft: DraftPayload = {
      id,
      title: 'Untitled',
      created: when,
      updated: when,
      data: collectState(),
    };
    SetCache(DRAFT_KEY(id), draft);
    writeIndex([...readIndex(), { id, title: draft.title, updated: when }]);
    SetCache(CURRENT_DRAFT_KEY, id);

    toastStore.show(
      `You just began a new dream. Draft created: ${id} (${draft.title})`,
    );
    return id;
  },

  save(id?: string) {
    if (typeof window === 'undefined') return;

    id ||= GetCache(CURRENT_DRAFT_KEY) || this.create();
    const draft = GetCache(DRAFT_KEY(id!)) as DraftPayload;
    if (!draft) return console.warn('Save: Unknown draft ID', id);

    draft.data = collectState();
    draft.updated = Date.now();

    SetCache(DRAFT_KEY(id!), draft);

    // sync index entry
    const list = readIndex();
    const entry = list.find((e) => e.id === id)!;
    entry.title = draft.data.storyData.name || 'Untitled';
    entry.updated = draft.updated;
    writeIndex(list);

    toastStore.show(`Draft saved: ${id} (${draft.title})`);
  },

  restore(id: string) {
    const draft = GetCache(DRAFT_KEY(id)) as DraftPayload;
    if (!draft) throw new Error('Draft not found');

    applyState(draft.data);
    SetCache(CURRENT_DRAFT_KEY, id);

    toastStore.show('You’re back where you left off');
  },

  delete(id: string) {
    ClearCache(DRAFT_KEY(id));
    writeIndex(readIndex().filter((e) => e.id !== id));
    if (GetCache(CURRENT_DRAFT_KEY) === id) ClearCache(CURRENT_DRAFT_KEY);

    toastStore.show(`Draft deleted: ${id}`, 'error');
  },

  list(): DraftIndexEntry[] {
    return readIndex().sort((a, b) => b.updated - a.updated);
  },
};

export default Drafts;
