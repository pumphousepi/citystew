// src/app/teams/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import EventCard from '../../components/EventCard';
import EventHeader from '../../components/EventHeader';

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
  _embedded?: {
    events: Event[];
  };
}

// Convert "los-angeles-lakers" to "Los Angeles Lakers"
function slugToName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ✅ Correct typing for App Router dynamic route
export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const teamName = slugToName(params.slug);

  const res = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(
      teamName
    )}&sort=date,asc&apikey=${process.env.TICKETMASTER_API_KEY}`
  );

  if (!res.ok) return notFound();

  const data: TicketmasterResponse = await res.json();
  const events = data._embedded?.events || [];

  const futureEvents = events.filter(e => {
    const dateStr = e.dates?.start?.localDate;
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return date >= new Date();
  });

  const firstEvent = futureEvents[0];

  return (
    <div className="bg-white min-h-screen">
      {firstEvent && (
        <EventHeader
          eventName={`${teamName} Events`}
          eventDateTime={
            `${firstEvent.dates.start.localDate}` +
            (firstEvent.dates.start.localTime
              ? ` at ${firstEvent.dates.start.localTime}`
              : '')
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
            {futureEvents.map(event => (
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
