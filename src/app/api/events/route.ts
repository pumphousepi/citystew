// src/app/api/events/route.ts
import { NextResponse } from 'next/server';

console.log(
  '🔑 TICKETMASTER_API_KEY is set?',
  Boolean(process.env.TICKETMASTER_API_KEY)
);


export async function GET(request: Request) {
  const API_KEY = process.env.TICKETMASTER_API_KEY;
  if (!API_KEY) {
    console.error('Missing TICKETMASTER_API_KEY');
    return NextResponse.json(
      { error: 'Missing Ticketmaster API key' },
      { status: 500 }
    );
  }

  // Base TM Discovery URL
  const tmUrl = new URL(
    'https://app.ticketmaster.com/discovery/v2/events.json'
  );
  tmUrl.searchParams.set('apikey', API_KEY);
  tmUrl.searchParams.set('size', '20');

  const { searchParams } = new URL(request.url);

  // City & State
  const city = searchParams.get('city');
  if (city) tmUrl.searchParams.set('city', city);
  const stateCode = searchParams.get('stateCode');
  if (stateCode) tmUrl.searchParams.set('stateCode', stateCode);

  // “Trending” → sort by popularity desc
  if (searchParams.get('trending') === 'true') {
    tmUrl.searchParams.set('sort', 'popularity,desc');
  }

  // “Upcoming” → sort by date asc
  if (searchParams.get('date') === 'upcoming') {
    tmUrl.searchParams.set('sort', 'date,asc');
  }

  // Category → segmentId mapping
  const category = searchParams.get('category');
  if (category) {
    const segmentMap: Record<string,string> = {
      music:  'KZFzniwnSyZfZ7v7nJ',
      sports: 'KZFzniwnSyZfZ7v7nE',
      theater:'KZFzniwnSyZfZ7v7na',
      family: 'KZFzniwnSyZfZ7v7n1',
    };
    const seg = segmentMap[category.toLowerCase()];
    if (seg) tmUrl.searchParams.set('segmentId', seg);
  }

  // Manual sort override (if you pass ?sort=…)
  const manualSort = searchParams.get('sort');
  if (manualSort) {
    tmUrl.searchParams.set('sort', manualSort);
  }

  try {
    const res = await fetch(tmUrl.toString());
    if (!res.ok) {
      console.error('TM API error', res.status);
      return NextResponse.json(
        { error: 'Ticketmaster API error' },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
