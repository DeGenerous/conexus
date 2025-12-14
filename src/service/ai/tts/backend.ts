import { type TTSProvider } from './provider';

export class BackendTTSProvider implements TTSProvider {
  private readonly apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async generateTTS(text: string): Promise<Blob> {
    const response = await fetch(`${this.apiUrl}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch TTS from backend');
    }

    const audioBlob = await response.blob();
    return audioBlob;
  }
}
