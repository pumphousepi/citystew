import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const KEY = process.env.GOOGLE_PLACES_API_KEY;
  if (!KEY) {
    return NextResponse.json({ error: 'Missing Google Places API key' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const city      = searchParams.get('city')     || 'Austin';
  const stateCode = searchParams.get('stateCode')|| 'TX';

  // Simple city→lat,lng map; expand for more locales
  const coords: Record<string,string> = {
    'Austin,TX': '30.2672,-97.7431',
    'Dallas,TX': '32.7767,-96.7970',
    'Houston,TX':'29.7604,-95.3698',
  };
  const location = coords[`${city},${stateCode}`] || coords['Austin,TX'];

  // Build Places Nearby Search URL
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('key', KEY);
  url.searchParams.set('location', location);
  url.searchParams.set('radius', '5000');
  url.searchParams.set('type', 'movie_theater');

  try {
    const res  = await fetch(url.toString());
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Places fetch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
