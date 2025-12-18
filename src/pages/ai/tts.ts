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

    let context: TTSOptions = {
      text: input.text,
    };

    if (typeof input.providerNameOrOpts === 'object') {
      context = { ...context, ...input.providerNameOrOpts };
    }

    if (
      typeof input.providerNameOrOpts === 'string' &&
      input.providerNameOrOpts === 'auto'
    ) {
      context = { ...context };
    }

    const audio = await ttsService.generateTTS(
      input.option,
      input.text,
      context || (input.providerNameOrOpts as TTSOptions),
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
