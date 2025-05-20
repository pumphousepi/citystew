'use client';

import { useEffect, useState } from 'react';
import EventCard from './EventCard'; // Adjust the import path if needed

interface ApiEvent {
  id: string;
  name: string;
  dates?: { start?: { localDate?: string } };
  _embedded?: { venues?: { name?: string; city?: { name?: string } }[] };
  images?: { url: string }[];
}

export default function TrendingEvents() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch('/api/events?trending=true');
        if (!res.ok) throw new Error('Failed to fetch trending events');
        const data = await res.json();
        setEvents(data._embedded?.events || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  if (loading) return <p>Loading trending events...</p>;
  if (events.length === 0) return <p>No trending events found.</p>;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Trending Events</h2>
        <div className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-2">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.name}
              image={event.images?.[0]?.url || '/placeholder.jpg'} // Fallback image if needed
              date={event.dates?.start?.localDate}
              venue={event._embedded?.venues?.[0]?.name}
              href={`/events/${event.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
