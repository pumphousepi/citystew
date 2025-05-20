import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const API_KEY = process.env.TICKETMASTER_API_KEY;
  const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

  try {
    const { searchParams } = new URL(request.url);
    const trending = searchParams.get('trending');

    // Base URL with city and API key
    let url = `${BASE_URL}?apikey=${API_KEY}&size=20&city=Austin`;

    // If trending is requested, add extra filters or queries to reflect trending
    // Since Ticketmaster API may not have a direct 'trending' filter,
    // you could filter events by popularity, classifications, or another heuristic
    if (trending === 'true') {
      // Example: filter for popular classifications like music or sports
      url += '&classificationName=music,sports';
      // Or you could change size or sort by popularity if the API supports it
      url += '&sort=date,asc'; // example sort param
    }

    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
