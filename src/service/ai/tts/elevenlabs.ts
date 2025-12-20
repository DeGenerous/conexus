import 'dotenv/config';

import { ElevenLabsClient, ElevenLabs } from '@elevenlabs/elevenlabs-js';

import type { TTSProvider } from '@service/ai/provider';

import PROVIDER_CONFIG from './utils';

export class ElevenLabsProvider implements TTSProvider {
  name = 'ELEVENLABS';

  voices = PROVIDER_CONFIG.ELEVENLABS.voices;
  models = PROVIDER_CONFIG.ELEVENLABS.models;

  readonly delivery = PROVIDER_CONFIG.ELEVENLABS.delivery;
  readonly response_format = PROVIDER_CONFIG.ELEVENLABS.response_format;

  private readonly elevenlabs: ElevenLabsClient;

  constructor() {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error(
        'ELEVENLABS_API_KEY environment variable is not set. Please set it to use ElevenLabs TTS.',
      );
    }
    this.elevenlabs = new ElevenLabsClient({ apiKey });
  }

  async generate(
    text: string,
    ctx: RequestContext,
    options?: TTSOptions,
  ): Promise<Blob> {
    const opts = this.validateAndMapOptions(ctx, options ?? ({} as TTSOptions));

    try {
      const stream = await this.elevenlabs.textToSpeech.convert(opts.voice, {
        text: text,
        modelId: opts.modelId,
        outputFormat: opts.outputFormat,
      });

      return this.convertToBlob(stream, 'audio/mpeg');
    } catch (error) {
      console.error('Error generating TTS:', error);
      throw error;
    }
  }

  async streamTTS(text: string): Promise<ReadableStream<Uint8Array>> {
    const audioStream = await this.elevenlabs.textToSpeech.stream(
      this.voices.casual,
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

  private validateAndMapOptions(ctx: RequestContext, req: TTSOptions) {
    const codec = req.format?.codec ?? 'mp3';
    const sampleRate = req.format?.sampleRate ?? 44100;
    const bitrate = req.format?.bitrate ?? 128;

    let outputFormat: string;
    if (codec === 'mp3') {
      if (sampleRate === 22050) {
        outputFormat = 'mp3_22050_32';
      } else if (sampleRate === 24000) {
        outputFormat = 'mp3_24000_48';
      } else {
        if (bitrate >= 192) outputFormat = 'mp3_44100_192';
        else if (bitrate >= 128) outputFormat = 'mp3_44100_128';
        else if (bitrate >= 96) outputFormat = 'mp3_44100_96';
        else if (bitrate >= 64) outputFormat = 'mp3_44100_64';
        else outputFormat = 'mp3_44100_32';
      }
    } else {
      const supportedPcmSampleRates = new Set([
        16000, 22050, 24000, 44100, 48000,
      ]);
      const pcmSampleRate = supportedPcmSampleRates.has(sampleRate)
        ? sampleRate
        : 44100;
      outputFormat = `pcm_${pcmSampleRate}`;
    }

    const voiceKey = req.voice ?? 'default';
    const voice =
      this.voices[voiceKey as keyof typeof PROVIDER_CONFIG.ELEVENLABS.voices] ??
      this.voices.default;

    const modelKey = ctx.model ?? 'default';
    const modelId =
      this.models[modelKey as keyof typeof PROVIDER_CONFIG.ELEVENLABS.models] ??
      this.models.default;

    const deliveryKey = req.delivery ?? 'default';
    const delivery =
      this.delivery[
        deliveryKey as keyof typeof PROVIDER_CONFIG.ELEVENLABS.delivery
      ] ?? this.delivery.default;

    return {
      voice: voice,
      modelId: modelId,
      delivery: delivery,
      outputFormat:
        outputFormat as ElevenLabs.TextToSpeechConvertRequestOutputFormat,
    };
  }
}
