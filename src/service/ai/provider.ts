/*
  AI Image Provider Interfaces
*/
export interface ImageProvider {
  name: string;

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
