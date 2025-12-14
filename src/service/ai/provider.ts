export interface ImageProvider {
  name: string;
  generate(prompt: string, ctx: RequestContext): Promise<ImageResult>;
}

export interface TTSProvider {
  name: string;
  generate(text: string, opts?: TTSOptions): Promise<Blob>;
}