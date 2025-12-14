import { type TTSProvider } from './provider';
import { BackendTTSProvider } from './backend';
import { ElevenLabsTTSProvider, DEFAULT_VOICES } from './elevenlabs';

class TTSService {
  private provider: TTSProvider;

  constructor(provider: TTSProvider) {
    this.provider = provider;
  }

  setProvider(provider: TTSProvider) {
    this.provider = provider;
  }

  async generateTTS(game: GameData): Promise<Blob> {
    return this.provider.generateTTS(game);
  }

  async streamTTS(
    game: GameData,
  ): Promise<ReadableStream<Uint8Array> | undefined> {
    if (this.provider.streamTTS) {
      return this.provider.streamTTS(game);
    }
    return undefined;
  }
}

// Singleton instance
export const ttsService = new TTSService(
  new ElevenLabsTTSProvider(
    import.meta.env.PUBLIC_ELEVENLABS_API_KEY,
    DEFAULT_VOICES.cheerful,
  ),
  //   new BackendTTSProvider(import.meta.env.PUBLIC_BACKEND_API_URL),
);
