import type { ImageProvider } from '@service/ai/provider';
import { withRetry } from '@service/ai/common/helper';
import { FalProvider } from '@service/ai/image/fal';
import { LumaProvider } from '@service/ai/image/luma';
import { FluxProvider } from '@service/ai/image/flux';

const imageProviders: ImageProvider[] = [
  new FalProvider(),
  new LumaProvider(),
  new FluxProvider(),
];

export async function generateImageWithFallback(
  prompt: string,
  ctx: RequestContext,
): Promise<ImageResult> {
  const errors: Error[] = [];

  for (const provider of imageProviders) {
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

            while (iterations < maxIterations) {
              await delay(3000);

              const status = await provider.status!(start.id);

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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
