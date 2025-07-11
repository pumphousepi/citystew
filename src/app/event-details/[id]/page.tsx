// src/app/event-details/[id]/page.tsx

import { Metadata } from 'next';
import EventHeader from '@/app/components/EventHeader';

interface EventPageProps {
  params: {
    id: string;
  };
}

// Optional metadata
export const generateMetadata = async ({ params }: EventPageProps): Promise<Metadata> => {
  return {
    title: `Event Details – ${params.id}`,
    description: 'Event info, tickets, and venue location',
  };
};

export default async function EventPage({ params }: EventPageProps) {
  const eventId = params.id;

  // Example fetch call to your backend or API route
  const res = await fetch(`${process.env.API_BASE_URL}/api/event-details/${eventId}`);
  const event = await res.json();

  if (!event) return <div className="p-10 text-red-600">Event not found</div>;

  return (
    <div className="min-h-screen">
      <EventHeader
        eventName={event.name}
        eventDateTime={event.date}
        venueName={event.venue}
        venueLocation={`${event.city}, ${event.state}`}
      />

      {/* Your ticket list, accordion, seating map, etc. goes here */}
      <section className="p-4">
        <h2 className="text-xl font-semibold mb-2">Tickets</h2>
        {/* Render event.tickets */}
      </section>
    </div>
  );
}
