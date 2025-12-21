import 'dotenv/config';

import { fal } from '@fal-ai/client';

import type { ImageProvider } from '@service/ai/provider';

import PROVIDER_CONFIG, { getModelDimensions } from './utils';

export class FalProvider implements ImageProvider {
  name = 'FAL' as const;

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

  async start(
    prompt: string,
    ctx?: RequestContext,
    opts?: ImageOptions,
  ): Promise<ImageStartResult> {
    const options = this.validateAndMapOptions(ctx, opts);

    const { imageType, data } = await this.generateFalImage(
      prompt,
      options.model.id,
      options.dimensions,
    );
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
    modelId: string,
    dimensions: ImageDimensions,
  ): Promise<{ imageType: ImageType; data: string }> {
    const resolvedDimensions = getModelDimensions(
      this.name,
      modelId,
      dimensions,
    );

    try {
      const result = await fal.subscribe(modelId, {
        input: {
          prompt: prompt,
          ...resolvedDimensions,
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

  private validateAndMapOptions(ctx?: RequestContext, opts?: ImageOptions) {
    const modelKey = ctx?.model ?? 'default';
    const model =
      this.models[modelKey as keyof typeof PROVIDER_CONFIG.FAL.models] ??
      this.models.default;

    const dimensionType = model.dimensionType as DimensionType;

    // Always return valid dimensions based on dimension type
    const getDefaultDimensions = (): ImageDimensions => {
      return dimensionType === 'aspectRatio'
        ? { aspect_ratio: '1:1' }
        : { width: 512, height: 512 };
    };

    let dimensions: ImageDimensions;

    if (opts?.dimensions) {
      const isAspectRatioValid =
        dimensionType === 'aspectRatio' && 'aspect_ratio' in opts.dimensions;
      const isSizeValid =
        dimensionType === 'size' && 'width' in opts.dimensions;

      dimensions =
        isAspectRatioValid || isSizeValid
          ? opts.dimensions
          : getDefaultDimensions();
    } else {
      dimensions = getDefaultDimensions();
    }

    return {
      model,
      dimensions,
    };
  }
}
