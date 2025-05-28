// src/app/api/events/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const API_KEY = process.env.TICKETMASTER_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: 'Missing Ticketmaster API key' }, { status: 500 });
  }

  // Base Ticketmaster Discovery API URL
  const tmUrl = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
  tmUrl.searchParams.set('apikey', API_KEY);
  tmUrl.searchParams.set('size', '20');

  const { searchParams } = new URL(request.url);

  // Propagate standard filters
  for (const key of ['city', 'stateCode', 'category', 'genre'] as const) {
    const val = searchParams.get(key);
    if (val) {
      // Ticketmaster expects 'classificationName' for genre
      if (key === 'genre') {
        tmUrl.searchParams.set('classificationName', val);
      } else {
        tmUrl.searchParams.set(key, val);
      }
    }
  }

  // Apply manual sort if provided, otherwise fall back
  const manualSort = searchParams.get('sort');
  if (manualSort) {
    tmUrl.searchParams.set('sort', manualSort);
  } else {
    // Trending → popularity desc
    if (searchParams.get('trending') === 'true') {
      tmUrl.searchParams.set('sort', 'popularity,desc');
    }
    // Upcoming → date asc
    if (searchParams.get('date') === 'upcoming') {
      tmUrl.searchParams.set('sort', 'date,asc');
    }
  }

  try {
    const res = await fetch(tmUrl.toString());
    if (!res.ok) {
      return NextResponse.json({ error: 'Ticketmaster API error' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
