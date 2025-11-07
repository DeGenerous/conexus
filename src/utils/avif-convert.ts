import * as Comlink from 'comlink';

// Thin wrapper that lazily spins up the AVIF Web Worker and proxies encode calls

let workerApi: Awaited<ReturnType<typeof init>> | null = null;

async function init() {
  const w = new Worker(new URL('/src/utils/avif.worker.ts', import.meta.url), {
    type: 'module',
  });
  const api = Comlink.wrap<{
    encodeAvif(file: ArrayBuffer): Promise<Blob>;
  }>(w);
  return api;
}

export interface AvifConvertOptions {
  /** Max allowed bytes for the converted file (slot limit). */
  maxBytes?: number;
  /** Require the AVIF to be <= minGain * original size (default 0.85). */
  minGain?: number;
}

export interface AvifConversionResult {
  file: File;
  converted: boolean;
  ratio: number; // converted / original
  before: number;
  after: number;
}

/**
 * Convert any image file → AVIF Blob (quality set in worker).
 * Returns whichever file (original or converted) should be uploaded.
 */
export async function toAvif(
  file: File,
  options: AvifConvertOptions = {},
): Promise<AvifConversionResult> {
  const { maxBytes, minGain = 0.85 } = options;
  if (!workerApi) workerApi = await init();

  const avif = await workerApi.encodeAvif(await file.arrayBuffer());
  const before = file.size || 1; // guard div/0
  const after = avif.size;
  const ratio = after / before;

  const convertedFile = new File([avif], file.name.replace(/\.\w+$/, '.avif'), {
    type: 'image/avif',
  });

  const passesGain = ratio <= minGain;
  const passesLimit = maxBytes ? after <= maxBytes : true;

  const keepAvif = passesGain && passesLimit;

  console.info(
    '[media] AVIF conversion',
    `${file.name}: ${formatBytes(before)} → ${formatBytes(after)} (${Math.round(ratio * 100)}%) • ${keepAvif ? 'converted' : 'kept original'}`,
  );

  return {
    file: keepAvif ? convertedFile : file,
    converted: keepAvif,
    ratio,
    before,
    after,
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const idx = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, idx);
  return `${
    value >= 10 || idx === 0 ? value.toFixed(0) : value.toFixed(1)
  } ${units[idx]}`;
}
