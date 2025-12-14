import 'dotenv/config';

import type { ImageProvider } from '@service/ai/provider';

export class LumaProvider implements ImageProvider {
  name = 'luma';

  private readonly apiUrl: string;
  private readonly lumaKeys = process.env.LUMA_API_KEY?.split(',')
    .map((k) => k.trim())
    .filter(Boolean);

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

  async start(prompt: string): Promise<ImageStartResult> {
    const body = {
      prompt: prompt,
      model: 'photon-flash-1',
    };

    const res = await fetch(`${this.apiUrl}/image`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error('Luma start failed');

    const data = await res.json();

    return { kind: 'job', id: data.id };
  }

  async status(id: string): Promise<ImageStatusResult> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'GET',
      headers: this.headers(),
    });

    if (!res.ok) throw new Error('Luma status check failed');

    const data = await res.json();

    if (data.state === 'failed') return { status: 'failed' };
    if (data.state === 'completed') {
      return {
        status: 'ready',
        image: { type: 'url', data: data.assets.image },
      };
    }

    return { status: 'pending' };
  }

  private getNextLumaKey(): string {
    if (!this.lumaKeys || this.lumaKeys.length === 0) {
      throw new Error('No LUMA API keys configured');
    }

    let lumaKeyIndex = 0;

    const key = this.lumaKeys[lumaKeyIndex];
    lumaKeyIndex = (lumaKeyIndex + 1) % this.lumaKeys.length;
    return key;
  }
}
