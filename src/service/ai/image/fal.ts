import 'dotenv/config';

import { fal } from '@fal-ai/client';

import type { ImageProvider } from '@service/ai/provider';

import PROVIDER_CONFIG from './utils';

export class FalProvider implements ImageProvider {
  name = 'FAL';

  readonly models = PROVIDER_CONFIG.FAL.models;

  constructor() {
    // check if FAL_KEY is set
    const apiKey = process.env.FAL_KEY;
    if (!apiKey) {
      throw new Error(
        'FAL_KEY environment variable is not set. Please set it to use FAL image generation.',
      );
    }
  }

  async start(prompt: string, ctx?: RequestContext): Promise<ImageStartResult> {
    const { imageType, data } = await this.generateFalImage(prompt, ctx);
    return {
      kind: 'ready',
      image: {
        imageType: imageType,
        data: data,
      },
    };
  }

  private async generateFalImage(
    prompt: string,
    ctx?: RequestContext,
  ): Promise<{ imageType: ImageType; data: string }> {
    let model: string = this.models.turbo;
    if (ctx?.model && Object.keys(this.models).includes(ctx.model as any)) {
      model = this.models[ctx.model as keyof typeof PROVIDER_CONFIG.FAL.models];
    }

    try {
      const result = await fal.subscribe(model, {
        input: {
          prompt: prompt,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });

      let url = '';
      if (result.data && result.data.images && result.data.images.length > 0) {
        url = result.data.images[0].url;
      }

      if (!url) {
        throw new Error('Failed to generate image: No image URL returned.');
      }

      return { imageType: 'url', data: url };
    } catch (error) {
      console.error('Error generating image:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
}
