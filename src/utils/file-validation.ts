import { toastStore } from '@stores/toast.svelte';

export interface MediaRule {
  mime: RegExp; // fast MIME test
  magic?: Uint8Array; // optional signature check
  maxBytes: number;
  maxFiles: number; // per slot
}

export const MEDIA_RULES: Record<MediaType, MediaRule> = {
  description: { mime: /^image\/avif$/, maxBytes: 1_572_864, maxFiles: 1 },
  tile: { mime: /^image\/avif$/, maxBytes: 1_572_864, maxFiles: 1 },
  background: { mime: /^image\/avif$/, maxBytes: 1_572_864, maxFiles: 3 },
  video: {
    mime: /^video\/mp4$/,
    maxBytes: 10_485_760,
    maxFiles: 1,
    // ISO BMFF “ftyp” box starts at byte 4
    magic: new TextEncoder().encode('ftyp'),
  },
  audio: {
    mime: /^audio\/mpeg$/,
    maxBytes: 6_291_456,
    maxFiles: 1,
    // MP3 frames start with 0xFF FB or ‘ID3’
    magic: new Uint8Array([0xff, 0xfb]),
  },
};

export async function validateFiles(
  slot: MediaType,
  files: File[],
  alreadyStored: number,
): Promise<File[]> {
  const rule = MEDIA_RULES[slot];
  const errors: string[] = [];

  /* 1. overall count */
  if (files.length + alreadyStored > rule.maxFiles) {
    errors.push(`You may upload max ${rule.maxFiles} file(s) for ${slot}.`);
  }

  /* 2. per‑file checks */
  const accepted: File[] = [];
  for (const f of files) {
    if (!rule.mime.test(f.type)) {
      errors.push(`“${f.name}” has wrong type (${f.type || 'unknown'}).`);
      continue;
    }
    if (f.size > rule.maxBytes) {
      errors.push(
        `“${f.name}” is too large (${(f.size / 1_048_576).toFixed(1)} MiB).`,
      );
      continue;
    }
    if (rule.magic) {
      const sig = new Uint8Array(await f.slice(4, 8).arrayBuffer());
      if (!sig.every((b, i) => b === rule.magic![i])) {
        errors.push(`“${f.name}” failed content check (signature mismatch).`);
        continue;
      }
    }
    accepted.push(f);
  }

  if (errors.length) toastStore.show(errors.join('\n'), 'error');
  return accepted;
}
