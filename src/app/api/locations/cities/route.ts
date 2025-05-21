// app/api/locations/cities/route.ts

import { NextRequest, NextResponse } from 'next/server';

const BACK4APP_APP_ID = 'XnjprAHf1ZhwzEOltO5ZyXB2JKJtjLkUEvUbwcGJ';
const BACK4APP_REST_API_KEY = 'LDZBZPRTmO2jD9H60Fdl2bosTVD7JV7sqyigBonz';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const state = url.searchParams.get('state');

  if (!state) {
    return NextResponse.json({ error: 'Missing state parameter' }, { status: 400 });
  }

  // Back4App Parse query syntax in REST API to filter cities by stateAbbreviation
  // URL encoding: where={"stateAbbreviation":"TX"}

  const whereQuery = encodeURIComponent(JSON.stringify({ stateAbbreviation: state }));

  const fetchUrl = `https://parseapi.back4app.com/classes/Cities?where=${whereQuery}`;

  try {
    const response = await fetch(fetchUrl, {
      headers: {
        'X-Parse-Application-Id': BACK4APP_APP_ID,
        'X-Parse-REST-API-Key': BACK4APP_REST_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
    }

    const data = await response.json();

    // Map cities to expected shape (name only)
    const cities = data.results.map((city: any) => ({
      name: city.name,
    }));

    return NextResponse.json(cities);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
