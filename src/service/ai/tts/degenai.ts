import 'dotenv/config';

import type { TTSProvider } from '@service/ai/provider';

export class DegenProvider implements TTSProvider {
  name = 'DegenAI';

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

  async generate(text: string, _opts?: TTSOptions): Promise<Blob> {
    if (!text) {
      throw new Error('TTS generation failed: text parameter cannot be empty');
    }

    const speechURL = `${this.apiUrl}/audio/speech`;

    const payload = {
      input: text,
      response_format: 'mp3',
      voice: 'af_kore',
      speed: 0.95,
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
