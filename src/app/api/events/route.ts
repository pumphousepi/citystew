import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const API_KEY = process.env.TICKETMASTER_API_KEY;
  const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

  try {
    const { searchParams } = new URL(request.url);
    const trending = searchParams.get('trending');
    const location = searchParams.get('location') || 'Austin';
    const dateRange = searchParams.get('dateRange');
    const category = searchParams.get('category'); // <-- NEW

    const params = new URLSearchParams({
      apikey: API_KEY || '',
      size: '20',
      city: location,
    });

    if (trending === 'true') {
      params.append('classificationName', 'music,sports');
      params.append('sort', 'date,asc');
    }

    if (category) {
      // Map your category param to Ticketmaster segmentId
      const categoryMap: Record<string, string> = {
        music: 'KZFzniwnSyZfZ7v7nJ',
        sports: 'KZFzniwnSyZfZ7v7nE',
        theater: 'KZFzniwnSyZfZ7v7na',
      };
      const segmentId = categoryMap[category.toLowerCase()];
      if (segmentId) {
        params.append('segmentId', segmentId);
      }
    }

    if (dateRange && dateRange.includes(',')) {
      const [startDate, endDate] = dateRange.split(',');
      params.append('startDateTime', `${startDate}T00:00:00Z`);
      params.append('endDateTime', `${endDate}T23:59:59Z`);
    }

    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('API fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
