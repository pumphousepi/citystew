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
      size: '256x256',   // valid options: "256x256" | "512x512" | "1024x1024"
    });

    // TS may not know about .data, so cast to any
    const url = (response as any).data?.[0]?.url ?? null;
    return NextResponse.json({ url });
  } catch (err) {
    console.error('AI image generation failed', err);
    return NextResponse.json({ url: null }, { status: 500 });
  }
}
