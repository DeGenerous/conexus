import type { APIRoute } from 'astro';

import ImageService from '@service/ai/image/service';

const imageService = new ImageService();

export const POST: APIRoute = async ({ request }) => {
  let body: { text: string; context: RequestContext };

  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  if (typeof body.text !== 'string' || body.text.trim().length === 0) {
    return new Response('Missing or empty text', { status: 400 });
  }

  try {
    const data = await imageService.generateImage(body.text, body.context);

    const cacheKey = `image-${Buffer.from(body.text).toString('base64')}`;

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
