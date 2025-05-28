// src/app/api/generate-image/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get('prompt') ?? 'A vibrant live event photo';

  try {
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: '512x512',
    });

    const aiUrl = response.data?.[0]?.url ?? null;

    // fallback to a random Unsplash “event” if AI fails
    const finalUrl =
      aiUrl ||
      `https://source.unsplash.com/400x300/?event,${encodeURIComponent(
        prompt
      )}`;

    return NextResponse.json({ url: finalUrl });
  } catch (err) {
    console.error('AI image generation failed', err);
    const fallback = `https://source.unsplash.com/400x300/?event`;
    return NextResponse.json({ url: fallback }, { status: 200 });
  }
}
