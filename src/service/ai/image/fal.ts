import { fal } from '@fal-ai/client';
import 'dotenv/config';

import type { ImageProvider } from '@service/ai/provider';

export class FalProvider implements ImageProvider {
  name = 'FAL';

  async start(prompt: string): Promise<ImageStartResult> {
    const { imageType, data } = await this.generateFalImage(prompt);
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
  ): Promise<{ imageType: ImageType; data: string }> {
    try {
      const result = await fal.subscribe('fal-ai/z-image/turbo', {
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

export async function startImageGeneration(prompt: string): Promise<string> {
  const { request_id } = await fal.queue.submit('fal-ai/z-image/turbo', {
    input: { prompt: prompt },
  });
  return request_id;
}
