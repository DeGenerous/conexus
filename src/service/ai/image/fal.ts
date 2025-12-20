import 'dotenv/config';

import { fal } from '@fal-ai/client';

import type { ImageProvider } from '@service/ai/provider';

export const MODELS = {
  turbo: 'fal-ai/z-image/turbo',
  nanobanana: 'fal-ai/nano-banana-pro',
  flux2: 'fal-ai/flux-2',
} as const;

export class FalProvider implements ImageProvider {
  name = 'FAL';
  readonly models = MODELS;

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
    let model: string = MODELS.turbo;
    if (ctx?.model && Object.values(MODELS).includes(ctx.model as any)) {
      model = ctx.model;
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
