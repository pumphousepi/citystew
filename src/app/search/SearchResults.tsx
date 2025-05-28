// src/app/search/SearchResults.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';

interface ApiEvent {
  id: string;
  name: string;
  dates?: { start?: { localDate?: string } };
  _embedded?: { venues?: { name: string; city?: { name: string } }[] };
  images?: { url: string }[];
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setEvents([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/events?search=${encodeURIComponent(query)}`
        );
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
    <>
      <h2 className="text-2xl font-bold mb-4">
        Search Results for: <em className="text-blue-600">{query}</em>
      </h2>

      {loading && <p>Loading...</p>}
      {!loading && events.length === 0 && (
        <p>No events found for &quot;{query}&quot;.</p>
      )}

      <div className="flex gap-6 overflow-x-auto py-4">
        {events.map((event) => {
          const venueName =
            event._embedded?.venues?.[0]?.name || 'Venue TBD';
          const eventDate =
            event.dates?.start?.localDate || 'Date TBD';
          const eventImage = event.images?.[0]?.url || '';

          return (
            <EventCard
              key={event.id}
              title={event.name}
              date={eventDate}
              venue={venueName}
              image={eventImage}
              href={`/events/${event.id}`}
            />
          );
        })}
      </div>
    </>
  );
}
