import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get('region') ?? 'US';

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing TMDB_API_KEY' }, { status: 500 });
  }

  const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&region=${region}&page=1`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ error: 'TMDB request failed', details: txt }, { status: 502 });
  }

  const data = await res.json();
  const movies = (data.results ?? []).slice(0, 12).map((m: any) => ({
    id: String(m.id),
    title: m.title,
    releaseDate: m.release_date,
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : '',
  }));

  return NextResponse.json({ movies });
}
