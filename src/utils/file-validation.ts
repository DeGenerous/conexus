/****************************************************************************
 *  Centralised media‑file validation
 *  ‑ lightweight (runs on main thread)
 *  ‑ slot‑aware limits (max files, max bytes)
 *  ‑ optional magic‑number checks for binary formats
 ***************************************************************************/

import { toastStore } from '@stores/toast.svelte';
import { blankImage } from '@constants/media';

/* -------------------------------------------------------------------- */
/* Types                                                                */
/* -------------------------------------------------------------------- */

export interface MagicSig {
  /** byte offset where the pattern must match */
  offset: number;
  /** exact byte sequence to match, no wild‑cards */
  pattern: Uint8Array;
}

export interface MediaRule {
  mime: RegExp; // quick type test
  maxBytes: number; // per‑file
  maxFiles: number; // per slot (already‑stored + new)
  magic?: MagicSig[]; // optional deep check (any match suffices)
}

/* -------------------------------------------------------------------- */
/* Constants                                                            */
/* -------------------------------------------------------------------- */

/** All bitmap formats we allow *before* client‑side AVIF conversion */
const GENERIC_IMAGE = /^(image\/(avif|jpeg|jpg|png|webp))$/i;

/** Size helpers */
const MiB = 1_048_576;

/* Slot‑specific constraints */
export const MEDIA_RULES: Record<MediaType, MediaRule> = {
  /* images ----------------------------------------------------------- */
  description: { mime: GENERIC_IMAGE, maxBytes: 3 * MiB, maxFiles: 1 },
  tile: { mime: GENERIC_IMAGE, maxBytes: 3 * MiB, maxFiles: 1 },
  background: { mime: GENERIC_IMAGE, maxBytes: 3 * MiB, maxFiles: 3 },

  /* video ------------------------------------------------------------ */
  video: {
    mime: /^video\/mp4$/i,
    maxBytes: 10 * MiB,
    maxFiles: 1,
    magic: [
      // ISO‑BMFF “ftyp” box starts at byte 4 (‘ftyp’/‘isom’/… acceptable)
      { offset: 4, pattern: new TextEncoder().encode('ftyp') },
    ],
  },

  /* audio ------------------------------------------------------------ */
  audio: {
    mime: /^audio\/mpeg$/i,
    maxBytes: 10 * MiB,
    maxFiles: 3,
    magic: [
      // MP3 frame sync
      { offset: 0, pattern: new Uint8Array([0xff, 0xfb]) },
      // or ID3 tag
      { offset: 0, pattern: new TextEncoder().encode('ID3') },
    ],
  },
};

/* -------------------------------------------------------------------- */
/* Validation function                                                  */
/* -------------------------------------------------------------------- */

/**
 * Validate a batch of files against slot‑specific rules.
 *
 * @param slot           'description' | 'tile' | 'background' | 'video' | 'audio'
 * @param files          FileList or Array<File>
 * @param alreadyStored  files already on the server for this slot
 * @returns              accepted files (subset of `files`)
 */
export async function validateFiles(
  slot: MediaType,
  files: File[],
  alreadyStored: number,
): Promise<File[]> {
  const rule = MEDIA_RULES[slot];
  const errors: string[] = [];

  /* 1 – global count -------------------------------------------------- */
  if (files.length + alreadyStored > rule.maxFiles) {
    errors.push(`You may upload max ${rule.maxFiles} file(s) for “${slot}”.`);
  }

  /* 2 – per‑file checks ---------------------------------------------- */
  const accepted: File[] = [];

  for (const f of files) {
    /* MIME */
    if (!rule.mime.test(f.type)) {
      errors.push(`“${f.name}” has wrong type (${f.type || 'unknown'}).`);
      continue;
    }

    /* size */
    if (f.size > rule.maxBytes) {
      errors.push(
        `“${f.name}” is too large (${(f.size / MiB).toFixed(1)} MiB).`,
      );
      continue;
    }

    /* magic numbers (if defined) */
    if (rule.magic) {
      const ok = await checkMagic(f, rule.magic);
      if (!ok) {
        errors.push(`“${f.name}” failed content check (signature mismatch).`);
        continue;
      }
    }

    accepted.push(f);
  }

  /* 3 – report ------------------------------------------------------- */
  if (errors.length) toastStore.show(errors.join('\n'), 'error');
  return accepted;
}

/* -------------------------------------------------------------------- */
/* Helpers                                                              */
/* -------------------------------------------------------------------- */

/** Returns `true` if any one of the signatures matches */
async function checkMagic(file: File, tests: MagicSig[]): Promise<boolean> {
  for (const { offset, pattern } of tests) {
    const slice = new Uint8Array(
      await file.slice(offset, offset + pattern.length).arrayBuffer(),
    );
    if (pattern.every((b, i) => b === slice[i])) return true;
  }
  return false;
}

/**
 * Quick client-side guard to ensure an image URL renders successfully.
 *
 * @param url candidate image source
 * @returns resolves `true` when the image can load, `false` otherwise
 */
export async function isRenderableImage(url: string): Promise<boolean> {
  if (!url || !url.trim()) {
    console.warn('[media] Skipping blank image source.');
    return false;
  }

  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    // Avoid SSR crashes; caller should supply a fallback
    console.warn('[media] Image guard unavailable in non-browser context.');
    return false;
  }

  return new Promise((resolve) => {
    const probe = new Image();

    const cleanup = () => {
      probe.onload = null;
      probe.onerror = null;
    };

    probe.onload = () => {
      cleanup();
      resolve(true);
    };

    probe.onerror = (event: Event) => {
      cleanup();
      console.warn('[media] Image failed to load:', url, event);
      resolve(false);
    };

    probe.src = url;
  });
}

/**
 * Resolve a potentially unsafe image source to a renderable URL.
 *
 * @param url       candidate image URL (absolute, relative, data/blob)
 * @param fallback  optional placeholder to use when the candidate cannot load
 */
export async function resolveRenderableImage(
  url: string | null | undefined,
  fallback: string = blankImage,
): Promise<string> {
  const candidate = url?.trim();
  if (!candidate) return fallback;
  if (candidate === fallback) return fallback;
  if (candidate.startsWith('data:') || candidate.startsWith('blob:')) {
    return candidate;
  }

  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    // No browser APIs available, continue with the provided placeholder
    return fallback;
  }

  const ok = await isRenderableImage(candidate);
  return ok ? candidate : fallback;
}
