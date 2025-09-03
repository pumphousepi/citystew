import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city') ?? '';
  const state = searchParams.get('state') ?? '';
  const limit = Math.min(Number(searchParams.get('limit') ?? '8'), 20);

  const apiKey = process.env.YELP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing YELP_API_KEY' }, { status: 500 });
  }

  const location = city && state ? `${city}, ${state}` : 'Austin, TX';

  const url = new URL('https://api.yelp.com/v3/businesses/search');
  url.searchParams.set('location', location);
  url.searchParams.set('categories', 'restaurants');
  url.searchParams.set('sort_by', 'rating');
  url.searchParams.set('limit', String(limit));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ error: 'Yelp request failed', details: txt }, { status: 502 });
  }

  const data = await res.json();
  const restaurants = (data.businesses ?? []).map((b: any) => ({
    id: b.id,
    name: b.name,
    rating: b.rating,
    price: b.price ?? '',
    image: b.image_url ?? '',
    url: b.url,
    categories: (b.categories ?? []).map((c: any) => c.title),
  }));

  return NextResponse.json({ restaurants });
}
