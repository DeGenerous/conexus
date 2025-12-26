import 'dotenv/config';

import type { ImageProvider } from '@service/ai/provider';

import PROVIDER_CONFIG from './utils';

export class FluxProvider implements ImageProvider {
  name = 'FLUX';

  readonly models = PROVIDER_CONFIG.FLUX.models;

  private readonly apiUrl: string;
  private readonly header: Record<string, string>;

  constructor(apiUrl: string = 'https://api.bfl.ml/v1') {
    const apiKey = process.env.FLUX_API_KEY;
    if (!apiKey) {
      throw new Error(
        'FLUX_API_KEY environment variable is not set. Please set it to use FluxProvider.',
      );
    }
    this.apiUrl = apiUrl;
    this.header = {
      'Content-Type': 'application/json',
      'x-key': apiKey,
    };
  }

  async start(
    prompt: string,
    ctx?: RequestContext,
    opts?: ImageOptions,
  ): Promise<ImageStartResult> {
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

    if (!res.ok) {
      let errorBody: string;
      try {
        errorBody = await res.text();
      } catch (e) {
        errorBody = '<unable to read body>';
      }
      throw new Error(`Flux start failed: status ${res.status} - ${errorBody}`);
    }

    const data = await res.json();

    return { kind: 'job', id: data.id };
  }

  async status(id: string): Promise<ImageStatusResult> {
    const res = await fetch(`${this.apiUrl}/get_result?id=${id}`, {
      method: 'GET',
      headers: this.header,
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(
        `Flux status check failed: status ${res.status} - ${errorBody}`,
      );
    }

    const data = await res.json();

    if (data.status === 'Pending') return { status: 'pending' };
    if (data.status === 'Ready') {
      return {
        status: 'ready',
        image: { imageType: 'url', data: data.result.sample },
      };
    }

    return { status: 'failed' };
  }
}
