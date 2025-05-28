// src/app/components/EventList.tsx
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
}

export default function EventList({ city, state }: EventListProps) {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (city) params.append('city', city);
        if (state) params.append('stateCode', state);

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
  }, [city, state]);

  if (loading) return <p>Loading events...</p>;
  if (events.length === 0) return <p>No events found.</p>;

  return (
<div className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-2">
  {(() => {
    const seen = new Set<string>();
    return events.map((event) => {
      const rawUrl = event.images?.[0]?.url;
      let imageUrl: string | undefined;
      if (rawUrl && !seen.has(rawUrl)) {
        seen.add(rawUrl);
        imageUrl = rawUrl;
      }
      return (
        <EventCard
          key={event.id}
          title={event.name}
          image={imageUrl}
          date={event.dates?.start?.localDate}
          venue={event._embedded?.venues?.[0]?.name}
          href={`/events/${event.id}`}
        />
      );
    });
  })()}
</div>

  );
}
