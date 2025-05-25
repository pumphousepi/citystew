import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const API_KEY = process.env.TICKETMASTER_API_KEY;
  const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'Austin';
    const state = searchParams.get('stateCode') || ''; // Optional
    const timeFilter = searchParams.get('timeFilter') || 'Today'; // e.g. Today, This Week
    const category = searchParams.get('category');
    const trending = searchParams.get('trending');

    const params = new URLSearchParams({
      apikey: API_KEY || '',
      size: '20',
      city,
    });

    if (state) {
      params.append('stateCode', state); // Ticketmaster expects 'stateCode' param
    }

    // Time filtering
    const now = new Date();
    let startDate = new Date(now);
    let endDate = new Date(now);

    switch (timeFilter.toLowerCase()) {
      case 'today':
        endDate.setHours(23, 59, 59);
        break;
      case 'this week':
        endDate.setDate(now.getDate() + 7);
        break;
      case 'this weekend':
        const day = now.getDay();
        const saturday = new Date(now);
        const sunday = new Date(now);
        saturday.setDate(now.getDate() + ((6 - day + 7) % 7)); // Next Saturday
        sunday.setDate(saturday.getDate() + 1); // Sunday
        startDate = saturday;
        endDate = sunday;
        break;
      case 'this month':
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      default:
        // If no valid filter, default to today
        endDate.setHours(23, 59, 59);
        break;
    }

    params.append('startDateTime', startDate.toISOString().split('.')[0] + 'Z');
    params.append('endDateTime', endDate.toISOString().split('.')[0] + 'Z');

    // Handle category filter
    if (category) {
      const categoryMap: Record<string, string> = {
        music: 'KZFzniwnSyZfZ7v7nJ',
        sports: 'KZFzniwnSyZfZ7v7nE',
        theater: 'KZFzniwnSyZfZ7v7na',
        family: 'KZFzniwnSyZfZ7v7n1', // added family segmentId example
      };
      const segmentId = categoryMap[category.toLowerCase()];
      if (segmentId) {
        params.append('segmentId', segmentId);
      }
    }

    // Handle trending filter if needed (example: sort by popularity)
    if (trending === 'true') {
      params.append('sort', 'relevance,desc');
    }

    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!res.ok) throw new Error('Ticketmaster API error');
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('API fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
