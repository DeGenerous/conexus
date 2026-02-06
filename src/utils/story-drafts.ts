import Topic from '@lib/topics';
import {
  clearAllData,
  currentDraft,
  collectState,
  applyState,
  buildFingerprint,
  draftSaveState,
  withSuppressedAutoSave,
} from '@stores/dream.svelte';
import { toastStore } from '@stores/toast.svelte';
import {
  GetCache,
  SetCache,
  ClearCache,
  CURRENT_DRAFT_KEY,
} from '@constants/cache';
import { get } from 'svelte/store';

let topic: Topic = new Topic();

const shortenID = (id: string) => id?.split('-')[0];

// Update fingerprint after successful save/create/restore
const updateSavedFingerprint = () => {
  draftSaveState.update((s) => ({
    ...s,
    lastSavedFingerprint: buildFingerprint(),
  }));
};

const Drafts = {
  async create(): Promise<string | null> {
    return withSuppressedAutoSave(async () => {
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
      updateSavedFingerprint();

      toastStore.show(
        `You just began a new dream. Draft created: ${shortenID(id!)}`,
      );
      return id;
    });
  },

  async save(id?: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // Check save lock - prevent concurrent saves
    const currentState = get(draftSaveState);
    if (currentState.isSaving) {
      return false;
    }

    // Check dirty state - skip if unchanged
    if (buildFingerprint() === currentState.lastSavedFingerprint) {
      return true;
    }

    // Set saving state
    draftSaveState.update((s) => ({ ...s, isSaving: true }));

    try {
      id ||= GetCache(CURRENT_DRAFT_KEY) || (await this.create()) || undefined;
      if (!id) {
        toastStore.show('No draft to save', 'error');
        draftSaveState.update((s) => ({ ...s, isSaving: false }));
        return false;
      }

      // Build payload entirely from local state - no fetch needed
      const draftData = collectState();
      const current = get(currentDraft);

      const draft: DraftPayload = {
        ...current,
        ...draftData,
        id,
        title: draftData.story_data.name || 'Untitled',
      };

      await topic.updateDraft(id, draft);

      // Update local state with new timestamp after successful save
      const now = new Date();
      draft.updated_at = now;
      currentDraft.set(draft);

      // Capture fingerprint AFTER save to avoid race condition
      draftSaveState.update((s) => ({
        ...s,
        isSaving: false,
        lastSavedFingerprint: buildFingerprint(),
      }));

      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Save failed';
      toastStore.show(`Draft save failed: ${errorMsg}`, 'error');
      draftSaveState.update((s) => ({ ...s, isSaving: false }));
      return false;
    }
  },

  async restore(id: string): Promise<void> {
    return withSuppressedAutoSave(async () => {
      let draft: Nullable<DraftPayload>;

      try {
        draft = await topic.getDraft(id);
      } catch {
        toastStore.show('Failed to restore draft', 'error');
        ClearCache(CURRENT_DRAFT_KEY);
        await this.create();
        return;
      }

      if (!draft) {
        toastStore.show('Draft not found', 'error');
        ClearCache(CURRENT_DRAFT_KEY);
        await this.create();
        return;
      }

      SetCache(CURRENT_DRAFT_KEY, id);
      applyState(draft);

      currentDraft.set(draft);
      updateSavedFingerprint();

      toastStore.show(
        `Draft ${shortenID(id as string)} restored - you're back where you left off`,
      );
    });
  },

  // Synchronous beacon save for beforeunload - queues request that survives page close
  saveBeacon(draftId?: string): boolean {
    const id = draftId || GetCache<string>(CURRENT_DRAFT_KEY);
    if (!id) return false;

    // Check dirty state - skip if unchanged
    const currentState = get(draftSaveState);
    const currentFingerprint = buildFingerprint();
    if (currentFingerprint === currentState.lastSavedFingerprint) {
      return true;
    }

    const draft = get(currentDraft);
    if (!draft) return false;

    const draftData = collectState();
    const payload = {
      ...draft,
      story_data: draftData.story_data,
      prompt_settings: draftData.prompt_settings,
      table_prompt: draftData.table_prompt,
      title: draftData.story_data.name || 'Untitled',
    };

    const blob = new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    });
    const url = `${import.meta.env.PUBLIC_BACKEND}/topic/drafts/${id}`;

    return navigator.sendBeacon(url, blob);
  },

  async delete(id: string) {
    if (GetCache(CURRENT_DRAFT_KEY) === id) ClearCache(CURRENT_DRAFT_KEY);

    await topic.deleteDraft(id);

    // toastStore.show(`Draft deleted: ${shortenID(id)}`);
  },
};

export default Drafts;
