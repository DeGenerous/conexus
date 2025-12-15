import 'dotenv/config';

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

import type { TTSProvider } from '@service/ai/provider';

export const DEFAULT_VOICES = {
  cheerful: '9BWtsMINqrJLrRacOk9x',
  casual: 'IKne3meq5aSn9XLyUdCD',
} as const;

export class ElevenLabsProvider implements TTSProvider {
  name = 'ElevenLabs';

  private readonly elevenlabs: ElevenLabsClient;
  private readonly voiceId: string;

  constructor(voiceId: string = DEFAULT_VOICES.cheerful) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error(
        'ELEVENLABS_API_KEY environment variable is not set. Please set it to use ElevenLabs TTS.',
      );
    }
    this.elevenlabs = new ElevenLabsClient({ apiKey });
    this.voiceId = voiceId;
  }

  async generate(text: string, _opts?: TTSOptions): Promise<Blob> {
    try {
      const stream = await this.elevenlabs.textToSpeech.convert(this.voiceId, {
        text: text,
        modelId: 'eleven_multilingual_v2',
        outputFormat: 'mp3_44100_128',
      });

      return this.convertToBlob(stream, 'audio/mpeg');
    } catch (error) {
      console.error('Error generating TTS:', error);
      throw error;
    }
  }

  async streamTTS(text: string): Promise<ReadableStream<Uint8Array>> {
    const audioStream = await this.elevenlabs.textToSpeech.stream(
      this.voiceId,
      {
        text: text,
        modelId: 'eleven_multilingual_v2',
        outputFormat: 'mp3_44100_128',
      },
    );

    return audioStream;
  }

  async convertToBlob(
    stream: ReadableStream<Uint8Array<ArrayBufferLike>>,
    mimeType: string = 'audio/mpeg',
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      (async () => {
        try {
          for await (const chunk of stream) {
            chunks.push(chunk);
          }
          const size = chunks.reduce((n, c) => n + c.length, 0);
          const buffer = new Uint8Array(size);
          let offset = 0;
          for (const c of chunks) {
            buffer.set(c, offset);
            offset += c.length;
          }
          resolve(new Blob([buffer], { type: mimeType }));
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}
