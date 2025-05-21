'use client';

import { useEffect, useState } from 'react';
import EventCard from './EventCard';
import TrendingEventsFilter from './TrendingEventsFilter';

interface ApiEvent {
  id: string;
  name: string;
  dates?: { start?: { localDate?: string } };
  _embedded?: { venues?: { name?: string; city?: { name?: string } }[] };
  images?: { url: string }[];
}

interface Filters {
  location: string;
  dateRange: string;
}

export default function TrendingEvents() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ location: 'San Antonio', dateRange: 'any' });

  useEffect(() => {
    async function fetchTrending() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('trending', 'true');
        if (filters.location) params.append('location', filters.location);
        if (filters.dateRange && filters.dateRange !== 'any') params.append('dateRange', filters.dateRange);

        const res = await fetch(`/api/events?${params.toString()}`);
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
  }, [filters]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <TrendingEventsFilter onFilterChange={setFilters} />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Trending Events in {filters.location}
        </h2>

        {loading && <p>Loading trending events...</p>}
        {!loading && events.length === 0 && <p>No trending events found.</p>}

        <div className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-2">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.name}
              image={event.images?.[0]?.url || '/placeholder.jpg'}
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
