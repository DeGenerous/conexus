import type { ImageProvider } from '@service/ai/provider';
import { withRetry } from '@service/ai/common/helper';
import { FalProvider } from '@service/ai/image/fal';
import { LumaProvider } from '@service/ai/image/luma';
import { FluxProvider } from '@service/ai/image/flux';

class ImageService {
  private imageProviders: ImageProvider[] = [];

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    if (this.imageProviders.length === 0) {
      try {
        this.imageProviders.push(new FalProvider());
      } catch (err) {
        console.error('Failed to initialize FalProvider:', err);
      }
      try {
        this.imageProviders.push(new LumaProvider());
      } catch (err) {
        console.error('Failed to initialize LumaProvider:', err);
      }
      try {
        this.imageProviders.push(new FluxProvider());
      } catch (err) {
        console.error('Failed to initialize FluxProvider:', err);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async selectProviderAndGenerateImage(
    text: string,
    providerName: string,
  ): Promise<string> {
    const provider = this.imageProviders.find((p) => p.name === providerName);
    if (!provider) {
      throw new Error(`Image provider "${providerName}" not found`);
    }
    return await withRetry(
      async (retryCtx) => {
        console.log(
          `Attempting image generation with ${provider.name}, attempt ${retryCtx.attempt}`,
        );
        try {
          const start = await provider.start(text);

          if (start.kind === 'ready') {
            return start.image.data;
          }

          console.log(
            `Image generation started with ${provider.name}, job ID: ${start.id}`,
          );

          const maxIterations = 20; // 1 minute timeout (20 * 3 seconds)
          let iterations = 0;
          const pollInterval = 3000;

          while (iterations < maxIterations) {
            await this.delay(pollInterval);

            if (!provider.status) {
              return Promise.reject(
                new Error(
                  `${provider.name} does not support job status polling`,
                ),
              );
            }

            const status = await provider.status(start.id);

            if (status.status === 'pending') {
              iterations++;
              continue;
            }
            if (status.status === 'ready') {
              return status.image.data;
            }

            return Promise.reject(
              new Error(`${provider.name} image generation failed`),
            );
          }

          return Promise.reject(
            new Error(`${provider.name} image generation timed out`),
          );
        } catch (err) {
          return Promise.reject(err);
        }
      },
      { retries: 2 },
    );
  }

  public async generateImageWithFallback(
    prompt: string,
    ctx: RequestContext,
  ): Promise<ImageResult> {
    const errors: Error[] = [];

    for (const provider of this.imageProviders) {
      try {
        return await withRetry(
          async (retryCtx) => {
            console.log(
              `Attempting image generation with ${provider.name}, attempt ${retryCtx.attempt}`,
            );
            try {
              const start = await provider.start(prompt);

              if (start.kind === 'ready') {
                return start.image;
              }

              console.log(
                `Image generation started with ${provider.name}, job ID: ${start.id}`,
              );

              const maxIterations = 20; // 1 minute timeout (20 * 3 seconds)
              let iterations = 0;

              let pollInterval = ctx.pollIntervalMs ?? 3000;

              while (iterations < maxIterations) {
                await this.delay(pollInterval);

                // Optional: Exponential backoff (uncomment if desired)
                // pollInterval = Math.min(pollInterval * 2, 15000); // cap at 15s

                if (!provider.status) {
                  return Promise.reject(
                    new Error(
                      `${provider.name} does not support job status polling`,
                    ),
                  );
                }

                const status = await provider.status(start.id);

                if (status.status === 'pending') {
                  iterations++;
                  continue;
                }
                if (status.status === 'ready') return status.image;

                return Promise.reject(
                  new Error(`${provider.name} image generation failed`),
                );
              }

              return Promise.reject(
                new Error(`${provider.name} image generation timed out`),
              );
            } catch (err) {
              return Promise.reject(err);
            }
          },
          ctx,
          { retries: 2 },
        );
      } catch (err) {
        errors.push(err as Error);
      }
    }

    throw new AggregateError(errors, 'All image providers failed');
  }

  public async generateImage(
    option: 'select' | 'fallback',
    text: string,
    providerNameOrCtx: string | RequestContext,
  ): Promise<string | ImageResult> {
    if (option === 'select') {
      if (typeof providerNameOrCtx !== 'string') {
        throw new Error('Provider name must be a string for select option');
      }
      return this.selectProviderAndGenerateImage(text, providerNameOrCtx);
    } else if (option === 'fallback') {
      if (typeof providerNameOrCtx !== 'object') {
        throw new Error('Context must be provided for fallback option');
      }
      return this.generateImageWithFallback(text, providerNameOrCtx);
    } else {
      throw new Error('Invalid option provided');
    }
  }
}

export default ImageService;
