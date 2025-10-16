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
  return workerApi.encodeAvif(await file.arrayBuffer());
}
