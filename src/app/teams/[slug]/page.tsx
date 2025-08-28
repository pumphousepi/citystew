// src/app/teams/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import EventCard from '../../components/EventCard';
import EventHeader from '../../components/EventHeader';
import type { Metadata, ResolvingMetadata } from 'next';

type Params = { slug: string };
type SearchParams = Record<string, string | string[] | undefined>;

interface Event {
  id: string;
  name: string;
  dates: {
    start: {
      localDate: string;
      localTime?: string;
    };
  };
  images: { url: string }[];
  _embedded?: {
    venues?: {
      name?: string;
      city?: { name?: string };
      state?: { stateCode?: string };
    }[];
  };
}

interface TicketmasterResponse {
  _embedded?: { events: Event[] };
}

function slugToName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Next 15: params is a Promise
export async function generateMetadata(
  { params }: { params: Promise<Params> },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const name = slugToName(slug);
  return {
    title: `${name} Events | CityStew`,
    description: `Find upcoming events for ${name} on CityStew.`,
  };
}

export default async function TeamEventsPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  await searchParams; // not used, but await to satisfy types

  const teamName = slugToName(slug);

  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) return notFound();

  const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(
    teamName
  )}&sort=date,asc&apikey=${apiKey}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return notFound();

  const data: TicketmasterResponse = await res.json();
  const events = data._embedded?.events ?? [];

  const today = new Date();
  const futureEvents = events.filter((e) => new Date(e.dates.start.localDate) >= today);

  const firstEvent = futureEvents[0];

  return (
    <div className="bg-white min-h-screen">
      {firstEvent && (
        <EventHeader
          eventName={`${teamName} Events`}
          eventDateTime={
            `${firstEvent.dates.start.localDate}` +
            (firstEvent.dates.start.localTime ? ` at ${firstEvent.dates.start.localTime}` : '')
          }
          venueName={firstEvent._embedded?.venues?.[0]?.name || ''}
          venueLocation={
            firstEvent._embedded?.venues?.[0]?.city?.name
              ? `${firstEvent._embedded.venues[0].city?.name}, ${
                  firstEvent._embedded.venues[0].state?.stateCode || ''
                }`
              : ''
          }
        />
      )}

      <main className="max-w-7xl mx-auto px-6 py-10">
        {futureEvents.length === 0 ? (
          <p className="text-gray-600">No upcoming events found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {futureEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.name}
                date={format(new Date(event.dates.start.localDate), 'yyyy-MM-dd')}
                image={event.images[0]?.url || ''}
                href={`/events/${event.id}`}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
