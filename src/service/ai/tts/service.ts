import { DegenProvider } from './degenai';
import { ElevenLabsProvider } from './elevenlabs';

import { type TTSProvider } from '../provider';

export const ttsProviders: TTSProvider[] = [
  new DegenProvider(),
  new ElevenLabsProvider(),
];

export async function generateTTSWithFallback(text: string): Promise<Blob> {
  const errors: Error[] = [];

  for (const provider of ttsProviders) {
    try {
      return await withRetry(() => provider.generate(text), {
        retries: 2,
        timeoutMs: 20_000,
      });
    } catch (err) {
      errors.push(err as Error);
      continue;
    }
  }

  throw new AggregateError(errors, 'All TTS providers failed');
}
