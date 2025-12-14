// example.mts
import { ElevenLabsClient, play, ElevenLabs } from '@elevenlabs/elevenlabs-js';
import { Readable } from 'stream';

import { type TTSProvider, constructTextFromGame } from './provider';

export class ElevenLabsTTSProvider implements TTSProvider {
  private readonly elevenlabs: ElevenLabsClient;
  private readonly voiceId: string;

  constructor(apiKey: string, voiceId: string) {
    this.elevenlabs = new ElevenLabsClient({ apiKey: () => apiKey });
    this.voiceId = voiceId;
  }

  async generateTTS(game: GameData): Promise<Blob> {
    const audio = await this.elevenlabs.textToSpeech.convert(this.voiceId, {
      text: constructTextFromGame(game),
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
    });

    // Convert the ReadableStream to a Blob
    const chunks: Uint8Array[] = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    // const audioBuffer = Buffer.concat(chunks);

    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const audioBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      audioBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    return new Blob([audioBuffer], { type: 'audio/mpeg' });
  }

  async streamTTS(game: GameData): Promise<ReadableStream<Uint8Array>> {
    const audioStream = await this.elevenlabs.textToSpeech.stream(
      this.voiceId,
      {
        text: constructTextFromGame(game),
        modelId: 'eleven_multilingual_v2',
        outputFormat: 'mp3_44100_128',
      },
    );

    return audioStream;
  }
}

const elevenlabs = new ElevenLabsClient({
  apiKey: () => process.env.PUBLIC_ELEVENLABS_API_KEY!,
});

interface DialogueInput {
  text: string;
  delivery?: string;
  voiceId?: string;
}

export const DEFAULT_VOICES = {
  cheerful: '9BWtsMINqrJLrRacOk9x',
  casual: 'IKne3meq5aSn9XLyUdCD',
} as const;

export async function convertTextToDialogue(
  inputs: DialogueInput[],
): Promise<void> {
  const formattedInputs = inputs.map((input) => ({
    text: input.delivery ? `[${input.delivery}] ${input.text}` : input.text,
    voiceId: input.voiceId || DEFAULT_VOICES.casual,
  }));

  const audio = await elevenlabs.textToDialogue.convert({
    inputs: formattedInputs,
  });

  await play(audio);
}

export async function convertTextToSpeech(
  text: string,
  voiceId: string = DEFAULT_VOICES.casual,
  modelId: string = 'eleven_multilingual_v2',
  outputFormat: ElevenLabs.OutputFormat = 'mp3_44100_128',
): Promise<void> {
  const audio = await elevenlabs.textToSpeech.convert(voiceId, {
    text,
    modelId,
    outputFormat,
  });

  await play(audio);
}

export async function convertTextToSpeechStream(
  text: string,
  voiceId: string = DEFAULT_VOICES.cheerful,
  modelId: string = 'eleven_multilingual_v2',
  outputFormat: ElevenLabs.OutputFormat = 'mp3_44100_128',
): Promise<void> {
  const audioStream = await elevenlabs.textToSpeech.stream(voiceId, {
    text,
    modelId,
    outputFormat,
  });

  const chunks: Uint8Array[] = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }
  const audioBuffer = Buffer.concat(chunks);

  await play(Readable.from(audioBuffer));
}
