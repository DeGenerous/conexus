import type { ImageProvider } from '../provider';
import { FalProvider } from './fal';

const imageProviders: ImageProvider[] = [new FalProvider()];

export async function generateImageWithFallback(
  prompt: string,
  ctx: RequestContext,
): Promise<ImageResult> {
  const errors: Error[] = [];

  for (const provider of imageProviders) {
    try {
      return await withRetry(() => provider.generate(prompt, ctx), {
        retries: 2,
        timeoutMs: 20_000,
      });
    } catch (err) {
      errors.push(err as Error);
      continue;
    }
  }

  throw new AggregateError(errors, 'All image providers failed');
}

