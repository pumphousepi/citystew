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

    </>
  );
}
