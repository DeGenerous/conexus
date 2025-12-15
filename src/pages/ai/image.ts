import type { APIRoute } from 'astro';

import { generateImageWithFallback } from '@service/ai/image/service';

export const POST: APIRoute = async ({ request }) => {
  let input: ImageGenerationInput;

  try {
    input = await request.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  if (!input.text) {
    return new Response('Missing text', { status: 400 });
  }

  try {
    const data = await generateImageWithFallback(input.text, {});

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
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
