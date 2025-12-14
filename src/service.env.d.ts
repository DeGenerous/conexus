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
};

type ImageResult = {
  data: string;
  type: ImageType;
};

type TTSOptions = {
  voiceId?: string;
  speed?: number;
  pitch?: number;
};

type MediaResult =
  | { status: 'ready'; data: string; type: 'url' | 'base64' }
  | { status: 'pending'; taskId: string };

type RetryOptions = {
  retries?: number;
};
