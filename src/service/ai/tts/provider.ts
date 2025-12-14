export interface TTSProvider {
  /**
   * Generate TTS audio for the given text.
   * @param text The text to convert to speech.
   * @returns A Promise that resolves to a Blob containing the audio data.
   */
  generateTTS(text: string): Promise<Blob>;

  /**
   * Stream TTS audio for the given text.
   * @param text The text to convert to speech.
   * @returns A Promise that resolves to a ReadableStream of audio data.
   */
  streamTTS?(text: string): Promise<ReadableStream<Uint8Array>>;
}
