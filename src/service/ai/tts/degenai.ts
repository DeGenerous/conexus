import 'dotenv/config';

import type { TTSProvider } from '@service/ai/provider';

export const DEFAULT_VOICES = {
  af_kore: 'af_kore',
  af_jpn: 'af_jpn',
  af_chn: 'af_chn',
  eu_esp: 'eu_esp',
  eu_fra: 'eu_fra',
  eu_ger: 'eu_ger',
  eu_ita: 'eu_ita',
  eu_rus: 'eu_rus',
  us_eng: 'us_eng',
  us_spa: 'us_spa',
} as const;

export class DegenProvider implements TTSProvider {
  name = 'DegenAI';
  voices = DEFAULT_VOICES;
  readonly response_format = ['mp3', 'wav'] as const;

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

  async generate(text: string, options?: TTSOptions): Promise<Blob> {
    if (!text) {
      throw new Error('TTS generation failed: text parameter cannot be empty');
    }

    const speechURL = `${this.apiUrl}/audio/speech`;

    const opts = toDegenAIPayload(options ?? ({} as TTSOptions));

    const payload = {
      input: text,
      voice: opts.voice ?? this.voices.af_kore,
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
    voice: req.voice ?? DEFAULT_VOICES.af_kore,
    speed: req.speed ?? 1.0,
  };
}
