import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const API_KEY = process.env.TICKETMASTER_API_KEY;
  const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location'); // city
    const state = searchParams.get('state');
    const dateRange = searchParams.get('dateRange'); // expected format: "YYYY-MM-DD,YYYY-MM-DD" or keywords

    const params = new URLSearchParams({
      apikey: API_KEY || '',
      size: '20',
    });

    // Add location filters
    if (location) {
      params.append('city', location);
    }
    if (state) {
      params.append('stateCode', state);
    }

    // Handle dateRange filter, e.g. "Today", "This Week", or explicit range
    if (dateRange) {
      if (dateRange.toLowerCase() === 'today') {
        const today = new Date();
        const start = today.toISOString().split('T')[0];
        const end = start;
        params.append('startDateTime', `${start}T00:00:00Z`);
        params.append('endDateTime', `${end}T23:59:59Z`);
      } else if (dateRange.toLowerCase() === 'this week') {
        const now = new Date();
        const dayOfWeek = now.getUTCDay();
        // Calculate start of week (Sunday)
        const sunday = new Date(now);
        sunday.setUTCDate(now.getUTCDate() - dayOfWeek);
        // Calculate end of week (Saturday)
        const saturday = new Date(sunday);
        saturday.setUTCDate(sunday.getUTCDate() + 6);

        const start = sunday.toISOString().split('T')[0];
        const end = saturday.toISOString().split('T')[0];
        params.append('startDateTime', `${start}T00:00:00Z`);
        params.append('endDateTime', `${end}T23:59:59Z`);
      } else if (dateRange.includes(',')) {
        // explicit date range, e.g. "2023-05-22,2023-05-28"
        const [startDate, endDate] = dateRange.split(',');
        params.append('startDateTime', `${startDate}T00:00:00Z`);
        params.append('endDateTime', `${endDate}T23:59:59Z`);
      }
    }

    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Ticketmaster API error: ${text}` }, { status: res.status });
    }
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('API fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
