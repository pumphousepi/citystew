// src/app/api/youtube/route.ts

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || 'concerts';
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key missing' }, { status: 500 });
  }

  const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(query)}&key=${apiKey}`;

  const res = await fetch(endpoint);
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch YouTube videos' }, { status: 500 });
  }

  const data = await res.json();
  const items = data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    channel: item.snippet.channelTitle,
    date: item.snippet.publishedAt,
  }));

  return NextResponse.json(items);
}
