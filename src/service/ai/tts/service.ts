import { type TTSProvider } from '@service/ai/provider';
import { withRetry } from '@service/ai/common/helper';
import { DegenProvider } from '@service/ai/tts/degenai';
import { ElevenLabsProvider } from '@service/ai/tts/elevenlabs';

export const ttsProviders: TTSProvider[] = [];

function getTTSProviders(): TTSProvider[] {
  if (ttsProviders.length === 0) {
    try {
      ttsProviders.push(new ElevenLabsProvider());
    } catch (err) {
      console.error('Failed to initialize ElevenLabsProvider:', err);
    }
    try {
      ttsProviders.push(new DegenProvider());
    } catch (err) {
      console.error('Failed to initialize DegenProvider:', err);
    }
  }
  return ttsProviders;
}

getTTSProviders();

export async function selectProviderAndGenerateTTS(
  text: string,
  providerName: string,
): Promise<Blob> {
  const provider = ttsProviders.find((p) => p.name === providerName);
  if (!provider) {
    throw new Error(`TTS provider "${providerName}" not found`);
  }
  return await withRetry((retryCtx) => provider.generate(text, {}), {
    retries: 2,
  });
}

export async function generateTTSWithFallback(text: string): Promise<Blob> {
  const errors: Error[] = [];

  for (const provider of ttsProviders) {
    try {
      return await withRetry((retryCtx) => provider.generate(text, {}), {
        retries: 2,
      });
    } catch (err) {
      errors.push(err as Error);
    }
  }

  throw new AggregateError(errors, 'All TTS providers failed');
}
