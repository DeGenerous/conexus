import type { APIRoute } from 'astro';

import TTSService from '@service/ai/tts/service';

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
    const ttsService = new TTSService();

    let thirdParam: string | TTSOptions;

    if (input.option === 'select' && typeof input.providerNameOrOpts === 'string') {
      thirdParam = input.providerNameOrOpts;
    } else if (typeof input.providerNameOrOpts === 'object') {
      thirdParam = input.providerNameOrOpts;
    } else {
      thirdParam = {};
    }

    const audio = await ttsService.generateTTS(
      input.option,
      input.text,
      thirdParam,
    );

    const cacheKey = `tts-${Buffer.from(input.text).toString('base64')}`;

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
