// src/app/components/ThreeColumnSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';

interface ApiEvent {
  id: string;
  name: string;
  dates?: {
    start?: { localDate?: string; localTime?: string };
  };
  _embedded?: {
    venues?: { name: string }[];
  };
  images?: { url: string }[];
}

interface ThreeColumnSectionProps {
  location: string; // e.g. "Austin, TX"
}

export default function ThreeColumnSection({ location }: ThreeColumnSectionProps) {
  const [sportsEvents, setSportsEvents] = useState<ApiEvent[]>([]);
  const [concertEvents, setConcertEvents] = useState<ApiEvent[]>([]);
  const [theaterEvents, setTheaterEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const [cityName, stateCode] = location.split(',').map((s) => s.trim());
    setLoading(true);

    // Helper that normalizes “either an array directly or an object { events: [...] }” → ApiEvent[]
    const normalize = (data: unknown): ApiEvent[] => {
      if (Array.isArray(data)) {
        return data as ApiEvent[];
      }
      const asObj = data as { events?: ApiEvent[] };
      return Array.isArray(asObj.events) ? asObj.events : [];
    };

    // Fetch events for a given category, then call the appropriate setter
    const fetchCategory = async (
      category: 'sports' | 'music' | 'theater',
      setter: React.Dispatch<React.SetStateAction<ApiEvent[]>>
    ) => {
      try {
        const res = await fetch(
          `/api/events?category=${category}&city=${encodeURIComponent(
            cityName
          )}&state=${encodeURIComponent(stateCode)}`
        );
        if (!res.ok) throw new Error();
        const raw = await res.json();
        setter(normalize(raw));
      } catch {
        setter([]);
      }
    };

    Promise.all([
      fetchCategory('sports', setSportsEvents),
      fetchCategory('music', setConcertEvents),
      fetchCategory('theater', setTheaterEvents),
    ]).finally(() => setLoading(false));
  }, [location]);

  if (loading) {
    return <p className="text-center py-10">Loading events…</p>;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ── SPORTS COLUMN ── */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Sports Near You</h3>
          {sportsEvents.length === 0 ? (
            <p className="text-sm text-gray-600">No sports events for {location}.</p>
          ) : (
            sportsEvents.map((evt) => (
              <EventCard
                key={evt.id}
                title={evt.name}
                image={evt.images?.[0]?.url}
                date={evt.dates?.start?.localDate}
                venue={evt._embedded?.venues?.[0]?.name}
                href={`/tickets/${evt.id}`}
                layout="vertical"
              />
            ))
          )}
        </div>

        {/* ── CONCERTS COLUMN ── */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Concerts Near You</h3>
          {concertEvents.length === 0 ? (
            <p className="text-sm text-gray-600">No concerts for {location}.</p>
          ) : (
            concertEvents.map((evt) => (
              <EventCard
                key={evt.id}
                title={evt.name}
                image={evt.images?.[0]?.url}
                date={evt.dates?.start?.localDate}
                venue={evt._embedded?.venues?.[0]?.name}
                href={`/tickets/${evt.id}`}
                layout="vertical"
              />
            ))
          )}
        </div>

        {/* ── THEATER COLUMN ── */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Theater Near You</h3>
          {theaterEvents.length === 0 ? (
            <p className="text-sm text-gray-600">No theater events for {location}.</p>
          ) : (
            theaterEvents.map((evt) => (
              <EventCard
                key={evt.id}
                title={evt.name}
                image={evt.images?.[0]?.url}
                date={evt.dates?.start?.localDate}
                venue={evt._embedded?.venues?.[0]?.name}
                href={`/tickets/${evt.id}`}
                layout="vertical"
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
