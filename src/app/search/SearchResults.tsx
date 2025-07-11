'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EventHeader from '../components/EventHeader';
import EventCard from '../components/EventCard';

interface ApiEvent {
  id: string;
  name: string;
  dates?: { start?: { localDate?: string } };
  _embedded?: { venues?: { name: string; city?: { name: string }, state?: { name: string } }[] };
  images?: { url: string }[];
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setEvents([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/events?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        const rawEvents = data._embedded?.events || [];

        // Deduplicate based on name + date
        const seen = new Set<string>();
        const deduped: ApiEvent[] = [];
        for (const ev of rawEvents) {
          const date = ev.dates?.start?.localDate || '';
          const key = `${ev.name}-${date}`;
          if (!seen.has(key)) {
            seen.add(key);
            deduped.push(ev);
          }
        }

        // Sort by soonest date
        deduped.sort((a, b) => {
          const da = a.dates?.start?.localDate || '9999-12-31';
          const db = b.dates?.start?.localDate || '9999-12-31';
          return da.localeCompare(db);
        });

        setEvents(deduped);
        if (deduped.length > 0) setExpandedId(deduped[0].id);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const renderEventDetails = (event: ApiEvent) => {
    const venue = event._embedded?.venues?.[0];
    const date = event.dates?.start?.localDate;
    const location = venue ? `${venue.city?.name}, ${venue.state?.name}` : '';
    const image = event.images?.[0]?.url;

    return (
      <div className="border rounded-lg shadow p-4 mb-4 bg-white">
        <EventHeader
          eventName={event.name}
          eventDateTime={date}
          venueName={venue?.name}
          venueLocation={location}
          imageUrl={image}
        />
        <div className="mt-4">
          <EventCard
            title={event.name}
            image={image}
            date={date}
            venue={venue?.name}
            href={`/events/${event.id}`}
          />
        </div>
      </div>
    );
  };

  return (
    <section className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Search Results for: <span className="text-blue-600">{query}</span></h1>
      {loading && <p>Loading...</p>}
      {!loading && events.length === 0 && <p>No events found.</p>}

      {!loading && events.map((event) => {
        const isExpanded = event.id === expandedId;
        return (
          <div key={event.id} className="mb-2">
            <button
              className="w-full text-left text-lg font-semibold text-blue-700 hover:underline"
              onClick={() => setExpandedId((prev) => (prev === event.id ? null : event.id))}
            >
              {event.name} ({event.dates?.start?.localDate})
            </button>
            {isExpanded && renderEventDetails(event)}
          </div>
        );
      })}
    </section>
  );
}
