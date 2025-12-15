/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type RequestContext = {
  requestId?: string; // trace across providers
  taskId?: string; // async jobs
  tenantId?: string; // future multi-tenancy
  webhookUrl?: string; // optional delivery
  retries?: number; // number of retries to attempt
  attempt?: number; // retry count
  timeoutMs?: number; // per-attempt timeout
  signal?: AbortSignal; // cancellation / timeout
  pollIntervalMs?: number; // job polling interval
};

type RetryOptions = {
  retries?: number;
};

type ImageGenerationInput = { text: string };

type DialogueInput = {
  delivery?: string;
  voiceId?: string;
} & ImageGenerationInput;

type TTSOptions = {
  voiceId?: string;
  speed?: number;
  pitch?: number;
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
