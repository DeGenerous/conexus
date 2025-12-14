import 'dotenv/config';

import type { ImageProvider } from '@service/ai/provider';

export class LumaProvider implements ImageProvider {
  name = 'luma';

  private readonly apiUrl: string;
  private readonly header: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.LUMA_API_KEY}`,
  };

  constructor(
    apiUrl: string = 'https://api.lumalabs.ai/dream-machine/v1/generations',
  ) {
    this.apiUrl = apiUrl;
  }

  async start(prompt: string): Promise<ImageStartResult> {
    const body = {
      prompt: prompt,
      model: 'photon-flash-1',
    };

    const res = await fetch(`${this.apiUrl}/image`, {
      method: 'POST',
      headers: this.header,
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error('Luma start failed');

    const data = await res.json();

    return { kind: 'job', id: data.id };
  }

  async status(id: string): Promise<ImageStatusResult> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'GET',
      headers: this.header,
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
}
