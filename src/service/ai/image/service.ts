import type { ImageProvider } from '@service/ai/provider';
import { withRetry } from '@service/ai/common/helper';
import { FalProvider } from '@service/ai/image/fal';
import { FluxProvider } from '@service/ai/image/flux';
import { LumaProvider } from '@service/ai/image/luma';

class ImageService {
  private imageProviders: ImageProvider[] = [];

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    const providers = [FalProvider, LumaProvider, FluxProvider];

    for (const Provider of providers) {
      try {
        this.imageProviders.push(new Provider());
      } catch (err) {
        console.error(`Failed to initialize ${Provider.name}:`, err);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async generateWithProvider(
    provider: ImageProvider,
    prompt: string,
    ctx: RequestContext,
  ): Promise<ImageResult | string> {
    return withRetry(
      async (retryCtx) => {
        console.log(
          `Attempting image generation with ${provider.name}, attempt ${retryCtx.attempt}`,
        );
        try {
          const start = await provider.start(prompt, ctx);

          if (start.kind === 'ready') {
            return ctx.option === 'select' ? start.image.data : start.image;
          }

          console.log(
            `Image generation started with ${provider.name}, job ID: ${start.id}`,
          );

          const maxIterations = 20; // 1 minute timeout (20 * 3 seconds)
          let iterations = 0;
          const pollInterval = ctx.pollIntervalMs ?? 3000;

          while (iterations < maxIterations) {
            await this.delay(pollInterval);

            if (!provider.status) {
              throw new Error(
                `${provider.name} does not support job status polling`,
              );
            }

            const status = await provider.status(start.id);

            if (status.status === 'pending') {
              iterations++;
              continue;
            }
            if (status.status === 'ready') {
              return ctx.option === 'select' ? status.image.data : status.image;
            }

            throw new Error(`${provider.name} image generation failed`);
          }

          throw new Error(`${provider.name} image generation timed out`);
        } catch (err) {
          throw err;
        }
      },
      ctx,
      { retries: 2 },
    );
  }

  public async handleSelectOption(
    text: string,
    ctx: RequestContext,
  ): Promise<string> {
    const providerName = ctx.provider;

    const provider = this.imageProviders.find((p) => p.name === providerName);
    if (!provider) {
      throw new Error(`Image provider "${providerName}" not found`);
    }

    return this.generateWithProvider(provider, text, ctx) as Promise<string>;
  }

  public async handleFallbackOption(
    prompt: string,
    ctx: RequestContext,
  ): Promise<ImageResult> {
    const errors: Error[] = [];

    for (const provider of this.imageProviders) {
      try {
        return (await this.generateWithProvider(
          provider,
          prompt,
          ctx,
        )) as ImageResult;
      } catch (err) {
        errors.push(err as Error);
      }
    }

    throw new AggregateError(errors, 'All image providers failed');
  }

  public async generateImage(
    text: string,
    ctx: RequestContext,
  ): Promise<string | ImageResult> {
    switch (ctx.option) {
      case 'select':
        if (typeof ctx.provider !== 'string') {
          throw new Error('Provider name must be a string for select option');
        }
        return this.handleSelectOption(text, ctx);
      case 'fallback':
        return this.handleFallbackOption(text, ctx);
      default:
        throw new Error('Invalid option provided');
    }
  }
}

export default ImageService;
