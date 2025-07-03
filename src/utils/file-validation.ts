import { toastStore } from '@stores/toast.svelte';

/* ──────────────────────────────── Types ──────────────────────────────── */

export interface MagicSig {
  /** byte offset inside the file where the pattern must be found */
  offset: number;
  /** byte sequence to match (no wild‑cards) */
  pattern: Uint8Array;
}

export interface MediaRule {
  mime: RegExp; // quick MIME check
  maxBytes: number; // maximum file size
  maxFiles: number; // per slot
  magic?: MagicSig[]; // optional one‑of‑many signature test
}

/* ─────────────────────────────── Rules ──────────────────────────────── */

export const MEDIA_RULES: Record<MediaType, MediaRule> = {
  description: { mime: /^image\/avif$/, maxBytes: 1_572_864, maxFiles: 1 },
  tile: { mime: /^image\/avif$/, maxBytes: 1_572_864, maxFiles: 1 },
  background: { mime: /^image\/avif$/, maxBytes: 1_572_864, maxFiles: 3 },

  video: {
    mime: /^video\/mp4$/,
    maxBytes: 10_485_760,
    maxFiles: 1,
    // ISO‑BMFF “ftyp” box (bytes 4‑7)
    magic: [{ offset: 4, pattern: new TextEncoder().encode('ftyp') }],
  },

  audio: {
    mime: /^audio\/mpeg$/,
    maxBytes: 6_291_456,
    maxFiles: 3,
    // Accept either bare MPEG frame‑sync or ID3 header at start of file
    magic: [
      { offset: 0, pattern: new Uint8Array([0xff, 0xfb]) }, // sync word
      { offset: 0, pattern: new TextEncoder().encode('ID3') }, // ID3 tag
    ],
  },
};

/* ─────────────────────────── Validation fn ──────────────────────────── */

export async function validateFiles(
  slot: MediaType,
  files: File[],
  alreadyStored: number,
): Promise<File[]> {
  const rule = MEDIA_RULES[slot];
  const errors: string[] = [];

  /* 1 — overall count --------------------------------------------------- */
  if (files.length + alreadyStored > rule.maxFiles) {
    errors.push(`You may upload max ${rule.maxFiles} file(s) for ${slot}.`);
  }

  /* 2 — per‑file checks ------------------------------------------------- */
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
        `“${f.name}” is too large (${(f.size / 1_048_576).toFixed(1)} MiB).`,
      );
      continue;
    }

    /* magic signatures */
    if (rule.magic) {
      let sigOK = false;

      for (const { offset, pattern } of rule.magic) {
        const blob = f.slice(offset, offset + pattern.length);
        const buf = new Uint8Array(await blob.arrayBuffer());

        if (pattern.every((b, i) => b === buf[i])) {
          sigOK = true;
          break;
        }
      }

      if (!sigOK) {
        errors.push(`“${f.name}” failed content check (signature mismatch).`);
        continue;
      }
    }

    accepted.push(f);
  }

  /* 3 — report ---------------------------------------------------------- */
  if (errors.length) toastStore.show(errors.join('\n'), 'error');
  return accepted;
}
