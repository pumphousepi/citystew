import { NextResponse } from 'next/server';

type City = {
  name: string;
  abbreviation: string;
  label: string;
};

export async function GET() {
  const cities: City[] = [
    { name: 'New Braunfels', abbreviation: 'TX', label: 'New Braunfels, TX' },
    { name: 'Amarillo', abbreviation: 'TX', label: 'Amarillo, TX' },
    { name: 'Arlington', abbreviation: 'TX', label: 'Arlington, TX' },
    { name: 'Austin', abbreviation: 'TX', label: 'Austin, TX' },
    { name: 'Corpus Christi', abbreviation: 'TX', label: 'Corpus Christi, TX' },
    { name: 'Dallas', abbreviation: 'TX', label: 'Dallas, TX' },
    { name: 'El Paso', abbreviation: 'TX', label: 'El Paso, TX' },
    { name: 'Fort Worth', abbreviation: 'TX', label: 'Fort Worth, TX' },
    { name: 'Garland', abbreviation: 'TX', label: 'Garland, TX' },
    { name: 'Houston', abbreviation: 'TX', label: 'Houston, TX' },
    { name: 'Irving', abbreviation: 'TX', label: 'Irving, TX' },
    { name: 'Laredo', abbreviation: 'TX', label: 'Laredo, TX' },
    { name: 'Lubbock', abbreviation: 'TX', label: 'Lubbock, TX' },
    { name: 'Plano', abbreviation: 'TX', label: 'Plano, TX' },
    { name: 'San Antonio', abbreviation: 'TX', label: 'San Antonio, TX' },
    { name: 'Phoenix', abbreviation: 'AZ', label: 'Phoenix, AZ' },
    { name: 'Los Angeles', abbreviation: 'CA', label: 'Los Angeles, CA' },
    { name: 'San Diego', abbreviation: 'CA', label: 'San Diego, CA' },
    { name: 'San Jose', abbreviation: 'CA', label: 'San Jose, CA' },
    { name: 'Denver', abbreviation: 'CO', label: 'Denver, CO' },
    { name: 'Jacksonville', abbreviation: 'FL', label: 'Jacksonville, FL' },
    { name: 'Miami', abbreviation: 'FL', label: 'Miami, FL' },
    { name: 'Tampa', abbreviation: 'FL', label: 'Tampa, FL' },
    { name: 'Atlanta', abbreviation: 'GA', label: 'Atlanta, GA' },
    { name: 'Chicago', abbreviation: 'IL', label: 'Chicago, IL' },
    { name: 'Indianapolis', abbreviation: 'IN', label: 'Indianapolis, IN' },
    { name: 'Louisville', abbreviation: 'KY', label: 'Louisville, KY' },
    { name: 'New Orleans', abbreviation: 'LA', label: 'New Orleans, LA' },
    { name: 'Baltimore', abbreviation: 'MD', label: 'Baltimore, MD' },
    { name: 'Boston', abbreviation: 'MA', label: 'Boston, MA' },
    { name: 'Detroit', abbreviation: 'MI', label: 'Detroit, MI' },
    { name: 'Minneapolis', abbreviation: 'MN', label: 'Minneapolis, MN' },
    { name: 'Kansas City', abbreviation: 'MO', label: 'Kansas City, MO' },
    { name: 'Las Vegas', abbreviation: 'NV', label: 'Las Vegas, NV' },
    { name: 'Charlotte', abbreviation: 'NC', label: 'Charlotte, NC' },
    { name: 'Omaha', abbreviation: 'NE', label: 'Omaha, NE' },
    { name: 'Albuquerque', abbreviation: 'NM', label: 'Albuquerque, NM' },
    { name: 'New York', abbreviation: 'NY', label: 'New York, NY' },
    { name: 'Columbus', abbreviation: 'OH', label: 'Columbus, OH' },
    { name: 'Cleveland', abbreviation: 'OH', label: 'Cleveland, OH' },
    { name: 'Oklahoma City', abbreviation: 'OK', label: 'Oklahoma City, OK' },
    { name: 'Philadelphia', abbreviation: 'PA', label: 'Philadelphia, PA' },
    { name: 'Memphis', abbreviation: 'TN', label: 'Memphis, TN' },
    { name: 'Nashville', abbreviation: 'TN', label: 'Nashville, TN' },
    { name: 'Seattle', abbreviation: 'WA', label: 'Seattle, WA' },
    { name: 'Milwaukee', abbreviation: 'WI', label: 'Milwaukee, WI' }
  ];

  return NextResponse.json(cities);
}
