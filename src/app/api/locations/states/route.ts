import { NextResponse } from 'next/server';

const BACK4APP_APP_ID = 'xtWVtCxyoMM9DRH8rphh7avA50Yo1PVHYfUFrPHm';
const BACK4APP_REST_API_KEY = 'Fgq1hIHc0BzQ7pTUQH83OJ2aFx98gzr43gnZlbIc';

export async function GET() {
  try {
    const res = await fetch('https://parseapi.back4app.com/classes/States?limit=100', {
      headers: {
        'X-Parse-Application-Id': BACK4APP_APP_ID,
        'X-Parse-REST-API-Key': BACK4APP_REST_API_KEY,
      },
    });

    const data = await res.json();

    if (!data.results) {
      return NextResponse.json([], { status: 200 });
    }

    // Alphabetize the states
    const states = data.results
      .map((state: any) => ({
        name: state.name,
        abbreviation: state.abbreviation,
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

    return NextResponse.json(states);
  } catch (err) {
    console.error('Error fetching states:', err);
    return NextResponse.json({ error: 'Failed to fetch states' }, { status: 500 });
  }
}
