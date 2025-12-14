import { fal } from '@fal-ai/client';
import 'dotenv/config';

import type { ImageProvider } from '@service/ai/provider';

export class FalProvider implements ImageProvider {
  name = 'FAL';

  async generate(prompt: string, ctx: RequestContext): Promise<ImageResult> {
    const { imageType, data } = await this.generateFalImage(prompt);
    return { type: imageType, data: data };
  }

  private async generateFalImage(
    prompt: string,
  ): Promise<{ imageType: ImageType; data: string }> {
    console.log('Generating FAL image for prompt:', prompt);

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

      return { imageType: 'url', data: url };
    } catch (error) {
      console.error('Error generating image:', error);
      return { imageType: 'url', data: '' };
    }
  }
}

export async function startImageGeneration(prompt: string): Promise<string> {
  const { request_id } = await fal.queue.submit('fal-ai/z-image/turbo', {
    input: { prompt: prompt },
  });
  return request_id;
}

export async function getImageGenerationStatus(
  requestId: string,
): Promise<{ status: string; imageUrl?: string }> {
  const status = await fal.queue.status('fal-ai/z-image/turbo', {
    requestId: requestId,
    logs: false,
  });
  return status;
}

export async function fetchGeneratedImage(requestId: string): Promise<Blob> {
  const result = await fal.queue.result('fal-ai/z-image/turbo', {
    requestId: requestId,
  });

  if (result.data && result.data.imageUrl) {
    const imageUrl = result.data.imageUrl;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return blob;
  } else {
    throw new Error('Image not ready or failed to generate.');
  }
}
