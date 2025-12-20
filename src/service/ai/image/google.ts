import 'dotenv/config';

import { GoogleGenAI } from '@google/genai';

import type { ImageProvider } from '@service/ai/provider';

export class GoogleProvider implements ImageProvider {
  name = 'Google';
  readonly models = {
    flash: 'gemini-2.5-flash-image',
  } as const;

  private readonly ai: GoogleGenAI;

  constructor() {
    // check if GOOGLE_API_KEY is set
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GOOGLE_API_KEY environment variable is not set. Please set it to use Google image generation.',
      );
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async start(prompt: string, _opts?: ImageOptions): Promise<ImageStartResult> {
    const { imageType, data } = await this.generateGoogleImage(prompt, _opts);
    return {
      kind: 'ready',
      image: {
        imageType: imageType,
        data: data,
      },
    };
  }

  private async generateGoogleImage(
    prompt: string,
    _opts?: ImageOptions,
  ): Promise<{ imageType: ImageType; data: string }> {
    let model: string = this.models.flash;
    if (
      _opts?.model &&
      Object.values(this.models).includes(_opts.model as any)
    ) {
      model = _opts.model;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];

        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.fileData && part.fileData.fileUri) {
              return { imageType: 'url', data: part.fileData.fileUri };
            }

            if (part.inlineData && part.inlineData.data) {
              return { imageType: 'base64', data: part.inlineData.data };
            }
          }
        }
      }

      throw new Error(
        'Failed to generate image: No valid image data returned.',
      );
    } catch (error) {
      console.error('Error generating image:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
}
