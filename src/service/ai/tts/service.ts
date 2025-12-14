import { type TTSProvider } from './provider';
import { BackendTTSProvider } from './backend';
import { ElevenLabsTTSProvider, DEFAULT_VOICES } from './elevenlabs';

export class TTSService {
  private provider: TTSProvider;

  constructor(provider: TTSProvider) {
    this.provider = provider;
  }

  setProvider(provider: TTSProvider) {
    this.provider = provider;
  }

  async generateTTS(text: string): Promise<Blob> {
    return this.provider.generateTTS(text);
  }

  async streamTTS(
    text: string,
  ): Promise<ReadableStream<Uint8Array> | undefined> {
    if (this.provider.streamTTS) {
      return this.provider.streamTTS(text);
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
