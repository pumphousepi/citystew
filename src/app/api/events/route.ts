// src/app/api/events/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const API_KEY = process.env.TICKETMASTER_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: 'Missing Ticketmaster API key' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const tmUrl = new URL('https://app.ticketmaster.com/discovery/v2/events.json');

  // required
  tmUrl.searchParams.set('apikey', API_KEY);

  // size
  const size = searchParams.get('size') || '20';
  tmUrl.searchParams.set('size', size);

  // location
  if (searchParams.get('city'))      tmUrl.searchParams.set('city', searchParams.get('city')!);
  if (searchParams.get('stateCode')) tmUrl.searchParams.set('stateCode', searchParams.get('stateCode')!);

  // category → segmentId
  if (searchParams.get('category')) {
    const map: Record<string,string> = {
      music: 'KZFzniwnSyZfZ7v7nJ',
      sports:'KZFzniwnSyZfZ7v7nE',
      theater:'KZFzniwnSyZfZ7v7na',
      family:'KZFzniwnSyZfZ7v7n1',
      food:  'KZFzniwnSyZfZ7v7nl',
    };
    const seg = map[searchParams.get('category')!.toLowerCase()];
    if (seg) tmUrl.searchParams.set('segmentId', seg);
  }

  // sort logic
  const manualSort = searchParams.get('sort');
  if (manualSort) {
    tmUrl.searchParams.set('sort', manualSort);
  } else if (searchParams.get('trending') === 'true') {
    // Trending: omit sort so TM uses its default ranking
    // (or use tmUrl.searchParams.set('sort','random') for random order)
  } else {
    // default “near you” order
    tmUrl.searchParams.set('sort', 'date,asc');
  }

  console.log('→ TM URL →', tmUrl.toString());

  try {
    const res  = await fetch(tmUrl.toString(), { next: { revalidate: 60 } });
    const data = await res.json();
    console.log('← TM RAW response →', JSON.stringify(data, null, 2));

    return NextResponse.json(data, {
      status: res.status,
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
