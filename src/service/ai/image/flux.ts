import 'dotenv/config';

import type { ImageProvider } from '@service/ai/provider';

export class FluxProvider implements ImageProvider {
  name = 'flux';

  private readonly apiUrl: string;
  private readonly header: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-key': `${process.env.FLUX_API_KEY}`,
  };

  constructor(apiUrl: string = 'https://api.bfl.ml/v1') {
    this.apiUrl = apiUrl;
  }

  async start(prompt: string): Promise<ImageStartResult> {
    const body = {
      prompt: prompt,
      width: 1024,
      height: 576,
    };

    const res = await fetch(`${this.apiUrl}/flux-pro-1.1`, {
      method: 'POST',
      headers: this.header,
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error('Flux start failed');

    const data = await res.json();

    return { kind: 'job', id: data.id };
  }

  async status(id: string): Promise<ImageStatusResult> {
    const res = await fetch(`${this.apiUrl}/get_result?id=${id}`, {
      method: 'GET',
      headers: this.header,
    });

    if (!res.ok) throw new Error('Flux status check failed');

    const data = await res.json();

    if (data.status === 'Pending') return { status: 'pending' };
    if (data.status === 'Ready') {
      return {
        status: 'ready',
        image: { type: 'url', data: data.result.sample },
      };
    }

    return { status: 'failed' };
  }
}
