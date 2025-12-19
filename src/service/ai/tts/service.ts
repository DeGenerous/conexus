import { type TTSProvider } from '@service/ai/provider';
import { withRetry } from '@service/ai/common/helper';
import { DegenProvider } from '@service/ai/tts/degenai';
import { ElevenLabsProvider } from '@service/ai/tts/elevenlabs';

import 'dotenv/config';

class TTSService {
  private ttsProviders: TTSProvider[] = [];

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    if (this.ttsProviders.length === 0) {
      try {
        this.ttsProviders.push(new ElevenLabsProvider());
      } catch (err) {
        console.error('Failed to initialize ElevenLabsProvider:', err);
      }
      try {
        this.ttsProviders.push(new DegenProvider());
      } catch (err) {
        console.error('Failed to initialize DegenProvider:', err);
      }
    }
  }

  public async selectProviderAndGenerateTTS(
    text: string,
    providerName: string,
    opts?: TTSOptions,
  ): Promise<Blob> {
    const provider = this.ttsProviders.find((p) => p.name === providerName);
    if (!provider) {
      throw new Error(`TTS provider "${providerName}" not found`);
    }
    return await withRetry((retryCtx) => provider.generate(text, opts), {
      retries: 2,
    });
  }

  public async generateTTSWithFallback(
    text: string,
    opts?: TTSOptions,
  ): Promise<Blob> {
    const errors: Error[] = [];

    for (const provider of this.ttsProviders) {
      try {
        return await withRetry((retryCtx) => provider.generate(text, opts), {
          retries: 2,
        });
      } catch (err) {
        errors.push(err as Error);
      }
    }

    throw new AggregateError(errors, 'All TTS providers failed');
  }

  public async generateTTS(
    option: 'select' | 'fallback',
    text: string,
    providerNameOrOpts: string | TTSOptions,
    opts?: TTSOptions,
  ): Promise<Blob> {
    if (option === 'select') {
      if (typeof providerNameOrOpts !== 'string') {
        throw new Error('Provider name must be a string for select option');
      }
      return this.selectProviderAndGenerateTTS(text, providerNameOrOpts, opts);
    } else if (option === 'fallback') {
      if (typeof providerNameOrOpts === 'string') {
        throw new Error('Options must not be a provider name for fallback option');
      }
      return this.generateTTSWithFallback(text, providerNameOrOpts);
    } else {
      throw new Error('Invalid option provided');
    }
  }
}

export default TTSService;
