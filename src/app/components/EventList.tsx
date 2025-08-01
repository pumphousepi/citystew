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
  category?: string; // ← New prop
}

export default function EventList({ city, state, category }: EventListProps) {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (city) params.append('city', city);
        if (state) params.append('stateCode', state);
        if (category) params.append('category', category); // ← Use category in API request

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
  }, [city, state, category]); // ← Add category to effect deps

  if (loading) return <p>Loading events...</p>;
  if (events.length === 0) return <p>No events found.</p>;

  const seenImages = new Set<string>();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {events.map((event) => {
        const imageUrl = event.images?.[0]?.url;
        if (!imageUrl || seenImages.has(imageUrl)) return null;
        seenImages.add(imageUrl);

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
      })}
    </div>
  );
}
