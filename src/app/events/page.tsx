'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
  }[];
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
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
    <div className="grid grid-cols-2 gap-4">
      {events.map(event => (
        <Link
          key={event.id}
          href={`/events/${event.id}`}
          className="block border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          {event.images && event.images.length > 0 && (
            <img
              src={event.images[0].url}
              alt={event.name}
              className="w-full h-36 object-cover rounded-md mb-3"
            />
          )}
          <h3 className="font-semibold text-lg">{event.name}</h3>
          <p className="text-sm text-gray-500">
            {event.dates?.start?.localDate || 'Date TBD'}
          </p>
        </Link>
      ))}
    </div>
  );
}
