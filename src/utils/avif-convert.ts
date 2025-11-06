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

/** Convert any image file → AVIF Blob (quality set in worker). */
export async function toAvif(file: File) {
  if (!workerApi) workerApi = await init();
  const avif = await workerApi.encodeAvif(await file.arrayBuffer());
  console.info(
    '[media] AVIF conversion',
    `${file.name}: ${formatBytes(file.size)} → ${formatBytes(avif.size)}`,
  );
  return avif;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const idx = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, idx);
  return `${value >= 10 || idx === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[idx]}`;
}
