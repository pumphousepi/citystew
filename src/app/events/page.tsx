'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import EventHeader from '../components/EventHeader';
import Footer from '../components/Footer';

interface Event {
  id: string;
  name: string;
  dates?: {
    start?: {
      localDate?: string;
    };
  };
  images?: { url: string }[];
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'Events';

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`/api/events?${searchParams.toString()}`);
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
  }, [searchParams]);

  const seen = new Set<string>();

  const getImage = (url: string | undefined) => {
    if (!url) return { src: undefined, isDuplicate: false };
    if (seen.has(url)) return { src: url, isDuplicate: true };
    seen.add(url);
    return { src: url, isDuplicate: false };
  };

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <EventHeader eventName={`CityStew ${category}`} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <p className="text-lg">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-lg text-gray-600">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => {
              const { src, isDuplicate } = getImage(event.images?.[0]?.url);
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block bg-white rounded-lg shadow hover:shadow-lg transition duration-300 border border-gray-200"
                >
                  {src && (
                    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={src}
                        alt={event.name}
                        className={`w-full h-full object-cover ${
                          isDuplicate ? 'blur-sm opacity-60' : ''
                        }`}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{event.name}</h3>
                    <p className="text-sm text-gray-500">
                      {event.dates?.start?.localDate || 'Date TBD'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
