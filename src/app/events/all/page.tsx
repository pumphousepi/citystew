'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import EventHeader from '../../components/EventHeader';
import Footer from '../../components/Footer';

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

export default function EventsPage() {
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

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <EventHeader eventName="CityStew Events" />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <p className="text-lg">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-lg text-gray-600">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                {event.images?.[0]?.url && (
                  <div className="relative w-full h-48">
                    <Image
                      src={event.images[0].url}
                      alt={event.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{event.name}</h3>
                  <p className="text-sm text-gray-500">
                    {event.dates?.start?.localDate || 'Date TBD'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
