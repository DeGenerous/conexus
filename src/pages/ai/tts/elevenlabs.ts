import type { APIRoute } from 'astro';
import { generateElevenLabsTTS, generateTTS } from '@service/ai/tts/elevenlabs';

export const POST: APIRoute = async ({ request }) => {
  const input = (await request.json()) as DialogueInput;

  const audio = await generateElevenLabsTTS(input.text);

  return new Response(audio, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
    },
  });
};
