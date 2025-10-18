export const runtime = 'edge';

function streamText(text: string, delayMs = 18): ReadableStream {
  const encoder = new TextEncoder();
  let i = 0;
  return new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        if (i >= text.length) {
          clearInterval(interval);
          controller.close();
          return;
        }
        const nextChunk = text.slice(i, i + Math.max(1, Math.floor(Math.random() * 4)));
        controller.enqueue(encoder.encode(nextChunk));
        i += nextChunk.length;
      }, delayMs);
    },
    cancel() {},
  });
}

export async function POST(req: Request) {
  const { prompt } = (await req.json()) as { prompt: string };
  const reply = `Here is an AI agent response to: "${prompt}"

- It supports markdown output
- Streams tokens like ChatGPT
- Styled with a Vercel/Linear-inspired dark theme`;
  const stream = streamText(reply);
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
