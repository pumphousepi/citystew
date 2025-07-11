import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('q') || '';

  const TM_API_KEY = process.env.TICKETMASTER_API_KEY;
  if (!TM_API_KEY) {
    return NextResponse.json({ error: 'API key missing' }, { status: 500 });
  }

  try {
    const tmRes = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TM_API_KEY}&keyword=${encodeURIComponent(keyword)}&size=12`
    );

    if (!tmRes.ok) throw new Error('Ticketmaster fetch failed');

    const data = await tmRes.json();
    const events = data._embedded?.events || [];

    return NextResponse.json(events);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
