'use client';

import { useEffect, useState } from 'react';
import EventCard from './EventCard';

interface ApiEvent {
  id: string;
  name: string;
  dates?: { start?: { localDate?: string } };
  _embedded?: { venues?: { name?: string; city?: { name?: string } }[] };
  images?: { url: string }[];
}

export default function EventList() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data._embedded?.events || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (events.length === 0) return <p>No events found.</p>;

  return (
    <div className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-2">
      {events.map((event) => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.name}
          image={event.images?.[0]?.url || '/placeholder.jpg'}
          date={event.dates?.start?.localDate}
          venue={event._embedded?.venues?.[0]?.name}
          href={`/events/${event.id}`}
        />
      ))}
    </div>
  );
}
