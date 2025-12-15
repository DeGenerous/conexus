import { type TTSProvider } from '@service/ai/provider';
import { withRetry } from '@service/ai/common/helper';
import { DegenProvider } from '@service/ai/tts/degenai';
import { ElevenLabsProvider } from '@service/ai/tts/elevenlabs';

export const ttsProviders: TTSProvider[] = [
  new DegenProvider(),
  new ElevenLabsProvider(),
];

export async function generateTTSWithFallback(text: string): Promise<Blob> {
  const errors: Error[] = [];

  for (const provider of ttsProviders) {
    try {
      return await withRetry((retryCtx) => provider.generate(text, {}), {
        retries: 2,
      });
    } catch (err) {
      errors.push(err as Error);
      continue;
    }
  }

  throw new AggregateError(errors, 'All TTS providers failed');
}
