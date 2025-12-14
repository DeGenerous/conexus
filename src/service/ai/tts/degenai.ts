import type { TTSProvider } from '../provider';

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

    console.log('Generating TTS with DegenAI');

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

    console.log('TTS generation successful');

    return await res.blob();
  }

  async generateDegenTTS(text: string, signal?: AbortSignal): Promise<Blob> {
    if (!text) {
      throw new Error('text is empty');
    }

    const baseURL = 'https://a3fq9nkvcxhp8k-8000.proxy.runpod.net/api/v1';

    const speechURL = `${baseURL}/audio/speech`;

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
      signal,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`TTS request failed (${res.status}): ${errText}`);
    }

    return await res.blob();

    // const buffer = await res.arrayBuffer();
    // if (buffer.byteLength === 0) {
    //   throw new Error('response body is empty');
    // }

    // return new Uint8Array(buffer);
  }
}
