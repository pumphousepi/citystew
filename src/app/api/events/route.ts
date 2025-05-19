// src/app/api/events/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.TICKETMASTER_API_KEY;
  const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

  try {
    const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&size=10&city=Austin`);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error); // Use the error to avoid the linting issue
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
