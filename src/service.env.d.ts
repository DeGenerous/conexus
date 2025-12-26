/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type RequestContext = {
  // Basic options
  option: 'select' | 'fallback';
  provider?: string;
  model?: string;

  // Advanced Retry options
  requestId?: string; // trace across providers
  attempt?: number; // retry count
  retries?: number; // number of retries to attempt
  pollIntervalMs?: number; // job polling interval
};

type RetryOptions = {
  retries?: number;
};

type AudioFormat = 'mp3' | 'wav';
type SampleRate = 22050 | 24000 | 44100 | 48000;

type TTSOptions = {
  voice?: string;
  delivery?: string;
  speed?: number;
  format?: {
    codec: AudioFormat;
    sampleRate: SampleRate;
    bitrate?: number;
  };
};

type ImageOptions = {
  dimensions?: ImageDimensions;
};

type ImageResult = {
  data: string;
  imageType: ImageType;
};

type ImageStartResult =
  | { kind: 'ready'; image: ImageResult }
  | { kind: 'job'; id: string };

type ImageStatusResult =
  | { status: 'pending' }
  | { status: 'ready'; image: ImageResult }
  | { status: 'failed' };

type ImageModel = {
  id: string;
  dimensionType: DimensionType;
};

type DimensionType = 'size' | 'aspectRatio';

type ImageDimensions =
  | { width: number; height: number }
  | { aspect_ratio: string };
