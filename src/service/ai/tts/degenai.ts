import 'dotenv/config';

import type { TTSProvider } from '@service/ai/provider';

import PROVIDER_CONFIG from './utils';

export class DegenProvider implements TTSProvider {
  name = 'DEGENAI';

  voices = PROVIDER_CONFIG.DEGENAI.voices;
  readonly response_format = PROVIDER_CONFIG.DEGENAI.response_format;

  private readonly apiUrl: string;

  constructor(apiUrl?: string) {
    const envApiUrl = process.env.DEGEN_API_URL;
    this.apiUrl = apiUrl ?? envApiUrl ?? '';
    if (!this.apiUrl) {
      throw new Error(
        'DegenProvider: API URL must be provided via constructor or DEGEN_API_URL environment variable',
      );
    }
  }

  async generate(
    text: string,
    ctx: RequestContext,
    options?: TTSOptions,
  ): Promise<Blob> {
    if (!text) {
      throw new Error('TTS generation failed: text parameter cannot be empty');
    }

    const speechURL = `${this.apiUrl}/audio/speech`;

    const opts = toDegenAIPayload(options ?? ({} as TTSOptions));

    let voice: string = this.voices.default;

    if (opts.voice && Object.keys(this.voices).includes(opts.voice as any)) {
      voice =
        this.voices[
          opts.voice as keyof typeof PROVIDER_CONFIG.DEGENAI.voices
        ];
    }

    const payload = {
      input: text,
      voice: voice,
      response_format: opts.response_format ?? 'mp3',
      speed: opts.speed ?? 0.95,
    };

    const res = await fetch(speechURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return Promise.reject(
        new Error(`TTS request failed (${res.status}): ${errText}`),
      );
    }

    return await res.blob();
  }
}

function toDegenAIPayload(req: TTSOptions) {
  return {
    response_format: req.format?.codec ?? 'mp3',
    voice: req.voice ?? PROVIDER_CONFIG.DEGENAI.voices.default,
    speed: req.speed ?? 1.0,
  };
}
