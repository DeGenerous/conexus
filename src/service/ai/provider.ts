/*
  AI Image Provider Interfaces
*/
export interface ImageProvider {
  name: string;

  start(prompt: string, ctx: RequestContext): Promise<ImageStartResult>;
  status?(id: string, ctx: RequestContext): Promise<ImageStatusResult>;
}

/*
  AI TTS Provider Interfaces
*/
export interface TTSOptions {
  voiceId?: string;
}
export interface TTSProvider {
  name: string;
  generate(text: string, opts?: TTSOptions): Promise<Blob>;
}
