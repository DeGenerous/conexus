/// <reference lib="webworker" />

import * as Comlink from 'comlink';
import { encode } from '@jsquash/avif';

/* ─────────── Config ─────────── */
const MAX_LONG_EDGE = 2000; // px
const QUALITY = 0.25; // 0‑1  (lower = smaller files)
const SUBSAMPLE = 1; // 0 = 4:4:4, 1 = 4:2:0 in lib defaults

/* ───────── Down‑scale helper ───────── */
async function downscale(img: ImageBitmap): Promise<ImageBitmap> {
  const scale =
    Math.max(img.width, img.height) > MAX_LONG_EDGE
      ? MAX_LONG_EDGE / Math.max(img.width, img.height)
      : 1;

  if (scale === 1) return img;

  const bmp = await createImageBitmap(img, {
    resizeWidth: Math.round(img.width * scale),
    resizeHeight: Math.round(img.height * scale),
    resizeQuality: 'high',
  });
  img.close();
  return bmp;
}

/* ───────── Main encode fn ───────── */
async function encodeAvif(src: ArrayBuffer): Promise<Blob> {
  /* 1 — decode original */
  const img = await createImageBitmap(new Blob([src]));
  const bmp = await downscale(img);

  /* 2 — native AVIF encode (Chrome 111 / Safari 17 / FF 122+) */
  const cvs = new OffscreenCanvas(bmp.width, bmp.height);
  cvs.getContext('2d')!.drawImage(bmp, 0, 0);

  const native = await cvs.convertToBlob?.({
    type: 'image/avif',
    quality: QUALITY,
  });
  if (native) return native;

  /* 3 — WASM fallback */
  const ctx = cvs.getContext('2d')!;
  const data = ctx.getImageData(0, 0, bmp.width, bmp.height);

  const avifBuffer = await encode(data, {
    quality: Math.round(QUALITY * 100), // jsQuash scale 0‑100
    speed: 6, // trade‑off quality / cpu
    subsample: SUBSAMPLE,
  });

  return new Blob([avifBuffer], { type: 'image/avif' });
}

/* ───────── Expose via Comlink ───────── */
Comlink.expose({ encodeAvif });
