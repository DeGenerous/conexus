import type { APIRoute } from 'astro';

import { generateImageWithFallback } from '@service/ai/image/service';

export const POST: APIRoute = async ({ request }) => {
  let input: ImageGenerationInput;

  try {
    input = await request.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  if (typeof input.text !== 'string' || input.text.trim().length === 0) {
    return new Response('Missing or empty text', { status: 400 });
  }

  try {
    const data = await generateImageWithFallback(input.text, {});

    const cacheKey = `tts-${Buffer.from(input.text).toString('base64')}`;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Cache-Key': cacheKey,
      },
    });
  } catch (err) {
    return new Response(
      err instanceof Error ? err.message : 'Image generation failed',
      {
        status: 500,
      },
    );
  }
};
