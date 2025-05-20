'use client';

import { useEffect, useState } from 'react';
import EventCard from './EventCard';

interface Event {
  id: string;
  name: string;
  dates?: {
    start?: {
      localDate?: string;
    };
  };
  images?: {
    url: string;
    width?: number;
    height?: number;
  }[];
  _embedded?: any;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        setEvents(data._embedded?.events || []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (events.length === 0) return <p>No events found.</p>;

return (
  <section className="py-12 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Events Near You</h2>
      <div className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-2">
        {events.map((event) => (
          <div key={event.id} className="flex-shrink-0 w-64">
            <EventCard
              id={event.id}
              title={event.name}
              date={event.dates?.start?.localDate}
              image={event.images?.[0]?.url || '/placeholder.jpg'}
              href={`/events/${event.id}`}
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

}
