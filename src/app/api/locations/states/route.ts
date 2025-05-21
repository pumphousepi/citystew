import { NextResponse } from 'next/server';

const BACK4APP_APP_ID = 'XnjprAHf1ZhwzEOltO5ZyXB2JKJtjLkUEvUbwcGJ';
const BACK4APP_REST_API_KEY = 'LDZBZPRTmO2jD9H60Fdl2bosTVD7JV7sqyigBonz';

interface State {
  name: string;
  abbreviation: string;
  [key: string]: unknown;
}

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

    const data: { results: State[] } = await response.json();

    const states = data.results.map((state) => ({
      name: state.name,
      abbreviation: state.abbreviation,
    }));

    return NextResponse.json(states);
  } catch (error) {
    console.error('Error fetching states:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
