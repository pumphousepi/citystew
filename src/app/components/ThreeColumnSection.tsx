// src/app/components/ThreeColumnSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ApiEvent {
  id: string;
  name: string;
  dates?: { start?: { localDate?: string } };
  _embedded?: { venues?: { name?: string }[] };
}

interface SectionConfig {
  title: string;
  category: string;
  imageUrl: string;
}

const SECTIONS: SectionConfig[] = [
  { title: 'Sports Near You', category: 'sports', imageUrl: '/assets/images/sports.jpg' },
  { title: 'Concerts Near You', category: 'music',  imageUrl: '/assets/images/concert_card_002.jpg' },
  { title: 'Theater Near You',  category: 'theater', imageUrl: '/assets/images/theater.jpg' },
];

export default function ThreeColumnSection({ location }: { location: string }) {
  const [lists, setLists]     = useState<ApiEvent[][]>(SECTIONS.map(() => []));
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);

  // Split “City, ST” into city and stateCode
  const [city, stateCode] = location.includes(',')
    ? location.split(',').map((s) => s.trim())
    : ['', ''];

  useEffect(() => {
    // If location isn't valid, skip fetching
    if (!city || !stateCode) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setRateLimited(false);

      const results = await Promise.all(
        SECTIONS.map(async ({ category }) => {
          // Skip TicketMaster fetch for theater
          if (category === 'theater') return [];

          const params = new URLSearchParams({
            city,
            stateCode,
            category,
            size: '5',
            sort: 'date,asc',
          });

          try {
            const res  = await fetch(`/api/events?${params.toString()}`);
            const data = await res.json();

            if (res.status === 429) {
              setRateLimited(true);
              return [];
            }
            if (!res.ok) {
              console.warn(`TicketMaster warning [${category}]:`, data.error || data);
              return [];
            }

            // Some endpoints return { _embedded: { events: [...] } }
            return (data._embedded?.events as ApiEvent[]) || [];
          } catch (err) {
            console.warn(`Fetch error [${category}]:`, err);
            return [];
          }
        })
      );

      setLists(results);
      setLoading(false);
    })();
  }, [city, stateCode]);

  // Do not render section at all if location is not “City, ST”
  if (!city || !stateCode) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SECTIONS.map((cfg, idx) => (
          <div
            key={cfg.title}
            className="flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <img
              src={cfg.imageUrl}
              alt={cfg.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-xl font-semibold mb-4">{cfg.title}</h3>

              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <p>Loading…</p>
                </div>
              ) : rateLimited ? (
                <p className="text-red-600">Rate limit exceeded, please wait a moment.</p>
              ) : lists[idx].length === 0 ? (
                <p className="text-gray-600">No events found.</p>
              ) : (
                <ul className="flex-1 overflow-y-auto space-y-2">
                  {lists[idx].map((event) => {
                    const date  = event.dates?.start?.localDate || 'TBD';
                    const venue = event._embedded?.venues?.[0]?.name || '';
                    return (
                      <li key={event.id}>
                        <Link
                          href={`/tickets/${event.id}`}
                          className="block hover:bg-gray-100 rounded px-2 py-1"
                        >
                          <div className="font-medium">{event.name}</div>
                          <div className="text-sm text-gray-600">
                            {date}
                            {venue && ` — ${venue}`}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
