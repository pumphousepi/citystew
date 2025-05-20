// src/app/event-details/[id]/page.tsx

interface EventResponse {
  name: string;
  dates: { start: { localDate: string; localTime?: string } };
  _embedded?: { venues?: { name: string; city?: { name: string } }[] };
}

type PageProps = {
  params: {
    id: string;
  };
};

async function getEvent(id: string): Promise<EventResponse | null> {
  try {
    const res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${process.env.TICKETMASTER_API_KEY}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export default async function EventPage({ params }: PageProps) {
  const event = await getEvent(params.id);

  if (!event) return <div>Event not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{event.name}</h1>
      <p className="mt-2">
        📅 {event.dates.start.localDate} {event.dates.start.localTime ? `at ${event.dates.start.localTime}` : ''}
      </p>
      <p className="mt-1">
        📍 {event._embedded?.venues?.[0]?.name}, {event._embedded?.venues?.[0]?.city?.name}
      </p>
    </div>
  );
}
