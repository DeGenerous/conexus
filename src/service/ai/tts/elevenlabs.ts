// src/server/tts/elevenlabs.ts
import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';
import 'dotenv/config';

import type { TTSProvider } from '../provider';

export const DEFAULT_VOICES = {
  cheerful: '9BWtsMINqrJLrRacOk9x',
  casual: 'IKne3meq5aSn9XLyUdCD',
} as const;

function convertToBlob(
  stream: ReadableStream<Uint8Array<ArrayBufferLike>>,
  mimeType: string = 'audio/mpeg',
): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    const chunks: Uint8Array[] = [];
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
  });
}

const client = new ElevenLabsClient();

export async function generateElevenLabsTTS(text: string): Promise<Blob> {
  console.log('Generating ElevenLabs TTS for text:', text);

  try {
    const stream = await client.textToSpeech.convert('9BWtsMINqrJLrRacOk9x', {
      text: text,
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
    });

    return convertToBlob(stream, 'audio/mpeg');
  } catch (error) {
    console.error('Error generating TTS:', error);
    return new Blob([], { type: 'audio/mpeg' });
  }
}

export async function generateTTS(dialogues: DialogueInput[]): Promise<Blob> {
  const formattedInputs = dialogues.map((input) => ({
    text: input.delivery ? `[${input.delivery}] ${input.text}` : input.text,
    voiceId: input.voiceId || 'IKne3meq5aSn9XLyUdCD',
  }));

  const audio = await client.textToDialogue.convert({
    inputs: formattedInputs,
  });

  return convertToBlob(audio, 'audio/mpeg');
}

export class ElevenLabsProvider implements TTSProvider {
  name = 'ElevenLabs';

  private readonly elevenlabs: ElevenLabsClient;
  private readonly voiceId: string;

  constructor(apiKey?: string, voiceId: string = DEFAULT_VOICES.cheerful) {
    this.elevenlabs = client;
    // this.elevenlabs = new ElevenLabsClient({ apiKey: () => apiKey });
    this.voiceId = voiceId;
  }

  async generate(text: string, opts?: TTSOptions): Promise<Blob> {
    try {
      const stream = await client.textToSpeech.convert('9BWtsMINqrJLrRacOk9x', {
        text: text,
        modelId: 'eleven_multilingual_v2',
        outputFormat: 'mp3_44100_128',
      });

      return convertToBlob(stream, 'audio/mpeg');
    } catch (error) {
      console.error('Error generating TTS:', error);
      return new Blob([], { type: 'audio/mpeg' });
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
}

// const elevenlabs = new ElevenLabsClient({
//   apiKey: () => process.env.PUBLIC_ELEVENLABS_API_KEY!,
// });

// export async function convertTextToDialogue(
//   inputs: DialogueInput[],
// ): Promise<void> {
//   const formattedInputs = inputs.map((input) => ({
//     text: input.delivery ? `[${input.delivery}] ${input.text}` : input.text,
//     voiceId: input.voiceId || DEFAULT_VOICES.casual,
//   }));

//   const audio = await elevenlabs.textToDialogue.convert({
//     inputs: formattedInputs,
//   });

//   await play(audio);
// }

// export async function convertTextToSpeech(
//   text: string,
//   voiceId: string = DEFAULT_VOICES.casual,
//   modelId: string = 'eleven_multilingual_v2',
//   outputFormat: ElevenLabs.OutputFormat = 'mp3_44100_128',
// ): Promise<void> {
//   const audio = await elevenlabs.textToSpeech.convert(voiceId, {
//     text,
//     modelId,
//     outputFormat,
//   });

//   await play(audio);
// }

// export async function convertTextToSpeechStream(
//   text: string,
//   voiceId: string = DEFAULT_VOICES.cheerful,
//   modelId: string = 'eleven_multilingual_v2',
//   outputFormat: ElevenLabs.OutputFormat = 'mp3_44100_128',
// ): Promise<void> {
//   const audioStream = await elevenlabs.textToSpeech.stream(voiceId, {
//     text,
//     modelId,
//     outputFormat,
//   });

//   const chunks: Uint8Array[] = [];
//   for await (const chunk of audioStream) {
//     chunks.push(chunk);
//   }
//   const audioBuffer = Buffer.concat(chunks);

//   await play(Readable.from(audioBuffer));
// }
