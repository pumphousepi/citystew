'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ApiEvent {
  id: string;
  name: string;
  dates?: { start?: { localDate?: string } };
  _embedded?: { venues?: { name: string; city?: { name: string } }[] };
  images?: { url: string }[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/events?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        setEvents(data._embedded?.events || []);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <section className="p-8 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">
        Search Results for: <em className="text-blue-600">{query}</em>
      </h2>

      {loading && <p>Loading...</p>}
      {!loading && events.length === 0 && <p>No events found for &quot;{query}&quot;.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="relative w-full h-40">
              {event.images?.[0]?.url && (
                <Image
                  src={event.images[0].url}
                  alt={event.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
              <p className="text-sm text-gray-600">
                {event.dates?.start?.localDate || 'Date TBD'}
              </p>
              <p className="text-sm text-gray-600">
                {event._embedded?.venues?.[0]?.name || 'Venue TBD'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
