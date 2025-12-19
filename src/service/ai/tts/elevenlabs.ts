import 'dotenv/config';

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

import type { TTSProvider } from '@service/ai/provider';

export const DEFAULT_VOICES = {
  cheerful: '9BWtsMINqrJLrRacOk9x',
  casual: 'IKne3meq5aSn9XLyUdCD',
} as const;

export const DEFAULT_MODELS = {
  multilingual: 'eleven_multilingual_v2',
  flash: 'eleven_flash_v2_5',
} as const;

export class ElevenLabsProvider implements TTSProvider {
  name = 'ElevenLabs';
  voices = DEFAULT_VOICES;
  models = DEFAULT_MODELS;
  response_format = [
    'mp3_22050_32',
    'mp3_24000_48',
    'mp3_44100_32',
    'mp3_44100_64',
    'mp3_44100_96',
    'mp3_44100_128',
    'mp3_44100_192',
    'pcm_16000',
    'pcm_22050',
    'pcm_24000',
    'pcm_44100',
    'pcm_48000',
  ];

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

  async generate(text: string, options?: TTSOptions): Promise<Blob> {
    const opts = toElevenPayload(options ?? ({} as TTSOptions));

    try {
      const stream = await this.elevenlabs.textToSpeech.convert(
        opts.voice ?? this.voices.casual,
        {
          text: text,
          modelId: opts.modelId ?? this.models.flash,
          outputFormat: opts.outputFormat ?? 'mp3_44100_128',
        },
      );

      return this.convertToBlob(stream, 'audio/mpeg');
    } catch (error) {
      console.error('Error generating TTS:', error);
      throw error;
    }
  }

  async streamTTS(text: string): Promise<ReadableStream<Uint8Array>> {
    const audioStream = await this.elevenlabs.textToSpeech.stream(
      DEFAULT_VOICES.casual,
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

function toElevenPayload(req: TTSOptions) {
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
    const supportedPcmSampleRates = new Set([16000, 22050, 24000, 44100, 48000]);
    const pcmSampleRate = supportedPcmSampleRates.has(sampleRate) ? sampleRate : 44100;
    outputFormat = `pcm_${pcmSampleRate}`;
  }

  return {
    voice: req.voice ?? DEFAULT_VOICES.casual,
    modelId: DEFAULT_MODELS.flash,
    outputFormat: outputFormat as
      | 'mp3_22050_32'
      | 'mp3_24000_48'
      | 'mp3_44100_32'
      | 'mp3_44100_64'
      | 'mp3_44100_96'
      | 'mp3_44100_128'
      | 'mp3_44100_192'
      | 'pcm_16000'
      | 'pcm_22050'
      | 'pcm_24000'
      | 'pcm_44100'
      | 'pcm_48000',
  };
}
