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

interface EventListProps {
  city?: string;
  state?: string;
  timeFilter?: string;
}

export default function EventList({ city, state, timeFilter }: EventListProps) {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        // Build query parameters based on props
        const params = new URLSearchParams();
        if (city) params.append('location', city);
        if (state) params.append('state', state);
        if (timeFilter) params.append('dateRange', timeFilter); // You may need to map to actual dates in backend

        const res = await fetch(`/api/events?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data._embedded?.events || []);
      } catch (error) {
        console.error(error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [city, state, timeFilter]);

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
