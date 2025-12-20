import 'dotenv/config';

import { ElevenLabsClient, ElevenLabs } from '@elevenlabs/elevenlabs-js';

import type { TTSProvider } from '@service/ai/provider';

import PROVIDER_CONFIG from './utils';

export class ElevenLabsProvider implements TTSProvider {
  name = 'ELEVENLABS';

  voices = PROVIDER_CONFIG.ELEVENLABS.voices;
  models = PROVIDER_CONFIG.ELEVENLABS.models;

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
    const opts = toElevenPayload(ctx, options ?? ({} as TTSOptions));

    let voice: string = this.voices.casual;

    if (opts.voice && Object.keys(this.voices).includes(opts.voice as any)) {
      voice =
        this.voices[
          opts.voice as keyof typeof PROVIDER_CONFIG.ELEVENLABS.voices
        ];
    }

    try {
      const stream = await this.elevenlabs.textToSpeech.convert(voice, {
        text: text,
        modelId: opts.modelId ?? this.models.flash,
        outputFormat: opts.outputFormat ?? 'mp3_44100_128',
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
}

function toElevenPayload(ctx: RequestContext, req: TTSOptions) {
  // Map requested format to valid ElevenLabs format
  const codec = req.format?.codec ?? 'mp3';
  const sampleRate = req.format?.sampleRate ?? 44100;
  const bitrate = req.format?.bitrate ?? 128;

  // Ensure we use valid combinations
  let outputFormat: string;
  if (codec === 'mp3') {
    if (sampleRate === 22050) {
      outputFormat = 'mp3_22050_32'; // 22050 only supports 32kbps
    } else if (sampleRate === 24000) {
      outputFormat = 'mp3_24000_48'; // 24000 only supports 48kbps
    } else {
      // 44100 supports multiple bitrates
      if (bitrate >= 192) outputFormat = 'mp3_44100_192';
      else if (bitrate >= 128) outputFormat = 'mp3_44100_128';
      else if (bitrate >= 96) outputFormat = 'mp3_44100_96';
      else if (bitrate >= 64) outputFormat = 'mp3_44100_64';
      else outputFormat = 'mp3_44100_32';
    }
  } else {
    // PCM formats
    const supportedPcmSampleRates = new Set([
      16000, 22050, 24000, 44100, 48000,
    ]);
    const pcmSampleRate = supportedPcmSampleRates.has(sampleRate)
      ? sampleRate
      : 44100;
    outputFormat = `pcm_${pcmSampleRate}`;
  }

  return {
    voice: req.voice ?? PROVIDER_CONFIG.ELEVENLABS.voices.casual,
    modelId: ctx.model ?? PROVIDER_CONFIG.ELEVENLABS.models.flash,
    outputFormat:
      outputFormat as ElevenLabs.TextToSpeechConvertRequestOutputFormat,
  };
}
