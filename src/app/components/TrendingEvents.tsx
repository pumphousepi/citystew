// src/app/components/TrendingEvents.tsx
'use client';

import { useEffect, useState } from 'react';
import EventCard from './EventCard';

interface ApiEvent {
  id: string;
  name: string;
  dates?: { start?: { localDate?: string } };
  _embedded?: { venues?: { name?: string; city?: { name?: string } }[] };
  images?: { url: string }[];
}

interface TrendingEventsProps {
  location: string;     // e.g. "Austin, TX"
  category?: string;    // e.g. "food", "sports", "theater", "music"
  genre?: string;       // for music genres or theatre sub‑types
}

export default function TrendingEvents({
  location,
  category,
  genre,
}: TrendingEventsProps) {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location.includes(',')) {
      setEvents([]);
      setLoading(false);
      return;
    }

    const [city, stateCode] = location.split(',').map((s) => s.trim());

    async function fetchTrending() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          city,
          stateCode,
          trending: 'true',
          date: 'upcoming',
        });
        if (category) params.append('category', category);
        if (genre)    params.append('genre', genre);

        const res = await fetch(`/api/events?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch trending events');
        const data = await res.json();
        setEvents(data._embedded?.events || []);
      } catch (error) {
        console.error(error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, [location, category, genre]);

  if (!location.includes(',')) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          Select a location above to see trending events.
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Trending Events in {location}
        </h2>

        {loading && <p>Loading trending events…</p>}
        {!loading && events.length === 0 && (
          <p>No trending events found for {location}.</p>
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

      </div>
    </section>
  );
}
