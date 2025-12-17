/*
  AI Image Provider Interfaces
*/
export interface ImageProvider {
  name: string;
  voices: object;
  models?: object;
  response_format?: string[];

  start(prompt: string, opts?: ImageOptions): Promise<ImageStartResult>;
  status?(id: string): Promise<ImageStatusResult>;
}

/*
  AI TTS Provider Interfaces
*/
export interface TTSProvider {
  name: string;
  generate(text: string, opts?: TTSOptions): Promise<Blob>;
}

export const defaultTTSRequest: Required<Omit<TTSOptions, 'text'>> = {
  voice: 'default',
  speed: 1.0,
  format: {
    codec: 'mp3',
    sampleRate: 44100,
    bitrate: 128,
  },
};
