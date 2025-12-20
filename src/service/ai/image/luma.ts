import 'dotenv/config';

import type { ImageProvider } from '@service/ai/provider';

import PROVIDER_CONFIG from './utils';

export class LumaProvider implements ImageProvider {
  name = 'LUMA';

  readonly models = PROVIDER_CONFIG.LUMA.models;

  private readonly apiUrl: string;
  private readonly lumaKeys = process.env.LUMA_API_KEY?.split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  private lumaKeyIndex = { value: 0 };

  constructor(
    apiUrl: string = 'https://api.lumalabs.ai/dream-machine/v1/generations',
  ) {
    this.apiUrl = apiUrl;
  }

  private headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getNextLumaKey()}`,
    };
  }

  async start(prompt: string, ctx?: RequestContext): Promise<ImageStartResult> {
    const body = {
      prompt: prompt,
      model: this.models.default,
    };

    const res = await fetch(`${this.apiUrl}/image`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let errorBody: string;
      try {
        errorBody = await res.text();
      } catch (e) {
        errorBody = '<failed to read error body>';
      }
      throw new Error(`Luma start failed: status ${res.status} - ${errorBody}`);
    }

    const data = await res.json();

    return { kind: 'job', id: data.id };
  }

  async status(id: string): Promise<ImageStatusResult> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'GET',
      headers: this.headers(),
    });

    if (!res.ok) {
      let errorBody: string;
      try {
        errorBody = JSON.stringify(await res.json());
      } catch {
        try {
          errorBody = await res.text();
        } catch {
          errorBody = '<unable to read body>';
        }
      }
      throw new Error(
        `Luma status check failed (status: ${res.status}): ${errorBody}`,
      );
    }

    const data = await res.json();

    if (data.state === 'failed') return { status: 'failed' };
    if (data.state === 'completed') {
      return {
        status: 'ready',
        image: { imageType: 'url', data: data.assets.image },
      };
    }

    return { status: 'pending' };
  }

  private getNextLumaKey(): string {
    if (!this.lumaKeys || this.lumaKeys.length === 0) {
      throw new Error('No LUMA API keys configured');
    }

    const key = this.lumaKeys[this.lumaKeyIndex.value];
    this.lumaKeyIndex.value =
      (this.lumaKeyIndex.value + 1) % this.lumaKeys.length;
    return key;
  }
}
