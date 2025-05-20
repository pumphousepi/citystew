'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    <div
      className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-2"
      style={{ scrollSnapType: 'x mandatory' }}
    >
      {events.map(event => (
        <Link
          key={event.id}
          href={`/events/${event.id}`}
          className="flex-shrink-0 w-60 rounded-lg border p-4 shadow-md hover:shadow-xl transition-shadow duration-300 scroll-snap-align-start"
        >
          {event.images && event.images.length > 0 && (
            <div className="relative w-full h-36 mb-3 rounded-md overflow-hidden">
              <Image
                src={event.images[0].url}
                alt={event.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
              />
            </div>
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
