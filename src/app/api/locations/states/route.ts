// app/api/locations/states/route.ts (or /pages/api/locations/states.ts if using pages API)

import { NextResponse } from 'next/server';

const BACK4APP_APP_ID = 'XnjprAHf1ZhwzEOltO5ZyXB2JKJtjLkUEvUbwcGJ';
const BACK4APP_REST_API_KEY = 'LDZBZPRTmO2jD9H60Fdl2bosTVD7JV7sqyigBonz';

export async function GET() {
  const url = 'https://parseapi.back4app.com/classes/States';

  try {
    const response = await fetch(url, {
      headers: {
        'X-Parse-Application-Id': BACK4APP_APP_ID,
        'X-Parse-REST-API-Key': BACK4APP_REST_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch states' }, { status: 500 });
    }

    const data = await response.json();
    // data.results is an array of state objects

    // Map the states to your frontend expected shape:
    // Assuming each state has fields: name and abbreviation
    const states = data.results.map((state: any) => ({
      name: state.name,
      abbreviation: state.abbreviation,
    }));

    return NextResponse.json(states);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
