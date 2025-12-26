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
    const providers = [ElevenLabsProvider, DegenProvider];

    for (const Provider of providers) {
      try {
        this.ttsProviders.push(new Provider());
      } catch (err) {
        console.error(`Failed to initialize ${Provider.name}:`, err);
      }
    }
  }

  private async generateWithProvider(
    provider: TTSProvider,
    text: string,
    ctx: RequestContext,
    opts?: TTSOptions,
  ): Promise<Blob> {
    return withRetry(
      async (retryCtx) => {
        console.log(
          `Attempting TTS generation with ${provider.name}, attempt ${retryCtx.attempt}`,
        );
        return provider.generate(text, retryCtx, opts);
      },
      ctx,
      { retries: ctx.retries ?? 2 },
    );
  }

  public async selectProviderAndGenerateTTS(
    text: string,
    ctx: RequestContext,
    opts?: TTSOptions,
  ): Promise<Blob> {
    const provider = this.ttsProviders.find((p) => p.name === ctx.provider);
    if (!provider) {
      throw new Error(`TTS provider "${ctx.provider}" not found`);
    }

    return this.generateWithProvider(provider, text, ctx, opts);
  }

  public async generateTTSWithFallback(
    text: string,
    ctx: RequestContext,
    opts?: TTSOptions,
  ): Promise<Blob> {
    const errors: Error[] = [];

    for (const provider of this.ttsProviders) {
      try {
        return await this.generateWithProvider(provider, text, ctx, opts);
      } catch (err) {
        errors.push(err as Error);
      }
    }

    throw new AggregateError(errors, 'All TTS providers failed');
  }

  public async generateTTS(
    text: string,
    ctx: RequestContext,
    options?: TTSOptions,
  ): Promise<Blob> {
    this.applyContextDefaults(ctx, options);

    switch (ctx.option) {
      case 'select':
        if (typeof ctx.provider !== 'string') {
          throw new Error('Provider name must be a string for select option');
        }
        return this.selectProviderAndGenerateTTS(text, ctx, options);
      case 'fallback':
        return this.generateTTSWithFallback(text, ctx, options);
      default:
        throw new Error('Invalid option provided');
    }
  }

  private applyContextDefaults(ctx: RequestContext, options?: TTSOptions) {
    ctx.option = import.meta.env.TTS_PROVIDER_OPTION ?? ctx.option;
    ctx.provider = import.meta.env.TTS_PROVIDER_NAME ?? ctx.provider;
    ctx.model = import.meta.env.TTS_PROVIDER_MODEL ?? ctx.model;

    if (options) {
      options.voice = import.meta.env.TTS_PROVIDER_VOICE ?? options.voice;
    } else {
      options = { voice: import.meta.env.TTS_PROVIDER_VOICE };
    }
  }
}

export default TTSService;
