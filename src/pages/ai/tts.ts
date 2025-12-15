import type { APIRoute } from 'astro';

import { generateTTSWithFallback } from '@service/ai/tts/service';

export const POST: APIRoute = async ({ request }) => {
  let input: DialogueInput;

  try {
    input = await request.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  if (typeof input.text !== 'string' || input.text.trim().length === 0) {
    return new Response('Missing or empty text', { status: 400 });
  }

  try {
    const audio = await generateTTSWithFallback(input.text);

    return new Response(audio, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return new Response(err instanceof Error ? err.message : 'TTS failed', {
      status: 500,
    });
  }
};
