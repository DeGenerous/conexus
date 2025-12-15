import type { TTSProvider } from '@service/ai/provider';

export class DegenProvider implements TTSProvider {
  name = 'DegenAI';

  private readonly apiUrl: string;

  constructor(
    apiUrl: string = 'https://a3fq9nkvcxhp8k-8000.proxy.runpod.net/api/v1',
  ) {
    this.apiUrl = apiUrl;
  }

  async generate(text: string, opts?: TTSOptions): Promise<Blob> {
    if (!text) {
      throw new Error('text is empty');
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
      console.error(`TTS request failed (${res.status}): ${errText}`);
      return Promise.reject(new Error('TTS request failed'));
    }

    return await res.blob();
  }
}
