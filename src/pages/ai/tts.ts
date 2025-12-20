import type { APIRoute } from 'astro';

import TTSService from '@service/ai/tts/service';

export const POST: APIRoute = async ({ request }) => {
  let body: { text: string; context: RequestContext; option: TTSOptions };

  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  if (typeof body.text !== 'string' || body.text.trim().length === 0) {
    return new Response('Missing or empty text', { status: 400 });
  }

  try {
    const ttsService = new TTSService();

    const audio = await ttsService.generateTTS(
      body.text,
      body.context,
      body.option,
    );

    const cacheKey = `tts-${Buffer.from(body.text).toString('base64')}`;

    return new Response(audio, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        ETag: cacheKey,
      },
    });
  } catch (err) {
    return new Response(err instanceof Error ? err.message : 'TTS failed', {
      status: 500,
    });
  }
};
