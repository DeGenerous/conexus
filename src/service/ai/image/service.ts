import type { ImageProvider } from '@service/ai/provider';
import { withRetry } from '@service/ai/common/helper';
import { FalProvider } from '@service/ai/image/fal';

const imageProviders: ImageProvider[] = [new FalProvider()];

export async function generateImageWithFallback(
  prompt: string,
  ctx: RequestContext,
): Promise<ImageResult> {
  const errors: Error[] = [];

  for (const provider of imageProviders) {
    try {
      return await withRetry(
        (retryCtx) => provider.generate(prompt, retryCtx),
        ctx,
        { retries: 2 },
      );
    } catch (err) {
      errors.push(err as Error);
    }
  }

  throw new AggregateError(errors, 'All image providers failed');
}
