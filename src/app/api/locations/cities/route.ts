import { NextResponse } from 'next/server';

const BACK4APP_APP_ID = 'xtWVtCxyoMM9DRH8rphh7avA50Yo1PVHYfUFrPHm';
const BACK4APP_REST_API_KEY = 'Fgq1hIHc0BzQ7pTUQH83OJ2aFx98gzr43gnZlbIc';

interface City {
  name: string;
  adminCode: string;
}

export async function GET() {
  try {
    const res = await fetch('https://parseapi.back4app.com/classes/City?limit=10000', {
      headers: {
        'X-Parse-Application-Id': BACK4APP_APP_ID,
        'X-Parse-REST-API-Key': BACK4APP_REST_API_KEY,
      },
    });

    const data = await res.json();

    const cities = data.results.map((item: City) => ({
      name: item.name,
      state: item.adminCode, // abbreviation
      label: `${item.name}, ${item.adminCode}`,
    }));

    return NextResponse.json(cities);
  } catch (error: unknown) {
    console.error('Failed to fetch cities:', error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}
