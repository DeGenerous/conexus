import { v4 as uuid } from 'uuid';
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
  DRAFTS_INDEX_KEY,
  DRAFT_KEY,
  CURRENT_DRAFT_KEY,
} from '@constants/cache';

const SCHEMA_VERSION = 1; // bump when shape changes

function readIndex(): DraftIndexEntry[] {
  return GetCache(DRAFTS_INDEX_KEY) || [];
}

function writeIndex(list: DraftIndexEntry[]) {
  SetCache(DRAFTS_INDEX_KEY, list);
}

const shortenID = (id: string) => id.split('-')[0];

const Drafts = {
  create(): string {
    clearAllData();

    const id = uuid();
    const when = Date.now();
    const draft: DraftPayload = {
      id,
      title: 'Untitled',
      created: when,
      updated: when,
      schema: SCHEMA_VERSION,
      data: collectState(),
    };

    SetCache(DRAFT_KEY(id), draft);
    writeIndex([...readIndex(), { id, title: draft.title, updated: when }]);
    SetCache(CURRENT_DRAFT_KEY, id);

    currentDraft.set(draft);
    toastStore.show(
      `You just began a new dream. Draft created: ${shortenID(id)} (${draft.title})`,
    );
    return id;
  },

  save(id?: string) {
    if (typeof window === 'undefined') return;

    id ||= GetCache(CURRENT_DRAFT_KEY) || this.create();
    const draft = structuredClone(GetCache<DraftPayload>(DRAFT_KEY(id!)));
    if (!draft) return toastStore.show(`Save unknown draft`, 'error');

    draft.data = collectState();
    draft.updated = Date.now();
    if (draft.data.storyData.name) draft.title = draft.data.storyData.name;

    SetCache(DRAFT_KEY(id!), draft);

    // sync index entry
    const list = readIndex();
    const entry = list.find((e) => e.id === id)!;
    entry.title = draft.data.storyData.name || 'Untitled';
    entry.updated = draft.updated;
    writeIndex(list);

    currentDraft.set(draft);
    toastStore.show(`Draft saved: ${shortenID(id as string)} (${draft.title})`);
  },

  restore(id: string) {
    const draft = GetCache<DraftPayload>(DRAFT_KEY(id));
    if (!draft) return toastStore.show('Draft not found', 'error');

    if (draft.schema !== SCHEMA_VERSION)
      return toastStore.show(
        'This draft is from an older version and cannot be loaded',
        'error',
      );

    applyState(draft.data);
    SetCache(CURRENT_DRAFT_KEY, id);

    currentDraft.set(draft);
    toastStore.show('Draft restored - you’re back where you left off');
  },

  delete(id: string) {
    ClearCache(DRAFT_KEY(id));
    writeIndex(readIndex().filter((e) => e.id !== id));
    if (GetCache(CURRENT_DRAFT_KEY) === id) ClearCache(CURRENT_DRAFT_KEY);

    toastStore.show(`Draft deleted: ${shortenID(id)}`);
  },

  list(): DraftIndexEntry[] {
    return readIndex().sort((a, b) => b.updated - a.updated);
  },
};

export default Drafts;
