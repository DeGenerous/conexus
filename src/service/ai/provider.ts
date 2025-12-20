/*
  AI Image Provider Interfaces
*/
export interface ImageProvider {
  name: string;
  models?: Record<string, string>;

  start(prompt: string, ctx?: RequestContext): Promise<ImageStartResult>;
  status?(id: string): Promise<ImageStatusResult>;
}

/*
  AI TTS Provider Interfaces
*/
export interface TTSProvider {
  name: string;

  voices: Record<string, string>;
  models?: Record<string, string>;

  response_format?: readonly string[] | string[];

  generate(text: string, ctx: RequestContext, opts?: TTSOptions): Promise<Blob>;
}

export const defaultTTSRequest: Required<Omit<TTSOptions, 'text'>> = {
  voice: 'default',
  delivery: '[cheerful]',
  speed: 1.0,
  format: {
    codec: 'mp3',
    sampleRate: 44100,
    bitrate: 128,
  },
};
