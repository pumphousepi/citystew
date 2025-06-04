'use client';

import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';

interface ApiEvent {
  id: string;
  name: string;
  dates?: { start?: { localDate?: string; localTime?: string } };
  _embedded?: { venues?: { name: string }[] };
  images?: { url: string }[];
}

interface ThreeColumnSectionProps {
  location: string;
}

export default function ThreeColumnSection({ location }: ThreeColumnSectionProps) {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const [cityName, stateCode] = location.split(', ').map((s) => s.trim());
    setLoading(true);

    fetch(
      `/api/events?city=${encodeURIComponent(cityName)}&state=${encodeURIComponent(stateCode)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data as ApiEvent[]);
        } else if (Array.isArray((data as any).events)) {
          setEvents((data as any).events);
        } else {
          setEvents([]);
        }
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [location]);

  if (loading) {
    return <p className="text-center py-10">Loading events…</p>;
  }

  if (events.length === 0) {
    return <p className="text-center py-10">No events found for {location}.</p>;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((evt) => {
          const imageUrl = evt.images?.[0]?.url || '/assets/images/placeholder.jpg';
          const dateStr = evt.dates?.start?.localDate
            ? `${evt.dates.start.localDate}${
                evt.dates.start.localTime ? ` @ ${evt.dates.start.localTime}` : ''
              }`
            : undefined;
          const venueName = evt._embedded?.venues?.[0]?.name;
          return (
            <EventCard
              key={evt.id}
              title={evt.name}
              image={imageUrl}
              date={dateStr}
              venue={venueName}
              href={`/tickets/${evt.id}`}
              layout="vertical"
            />
          );
        })}
      </div>
    </section>
  );
}
