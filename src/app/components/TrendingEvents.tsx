'use client';

import { useEffect, useState } from 'react';
import EventCard from './EventCard';
import NavButton from './NavButton';

interface ApiEvent {
  id: string;
  name: string;
  images?: { url: string }[];
  dates?: { start?: { localDate?: string } };
  _embedded?: { venues?: { name?: string }[] };
}

interface CityOption {
  name: string;
  abbreviation: string;
  label: string; // e.g. "Austin, TX"
}

interface TrendingEventsProps {
  location: string;                  // e.g. "Austin, TX"
  category?: string;
  genre?: string;
  onSelectLocation: (loc: string) => void;
}

export default function TrendingEvents({
  location,
  category,
  genre,
  onSelectLocation,
}: TrendingEventsProps) {
  const [events, setEvents]         = useState<ApiEvent[]>([]);
  const [loading, setLoading]       = useState(true);
  const [cities, setCities]         = useState<CityOption[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 1. load city list
  useEffect(() => {
    fetch('/api/locations/cities')
      .then(r => r.json())
      .then((data: CityOption[]) => setCities(data))
      .catch(console.error);
  }, []);

  // 2. load trending events
  useEffect(() => {
    if (!location.includes(',')) {
      setEvents([]);
      setLoading(false);
      return;
    }
    const [city, stateCode] = location.split(',').map(s => s.trim());
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          city,
          stateCode,
          trending: 'true',
          date: 'upcoming',           // ← you had this in your original TM query
        });
        if (category) params.append('category', category);
        if (genre)    params.append('genre', genre);

        const res  = await fetch(`/api/events?${params.toString()}`);
        const json = (await res.json()) as { _embedded?: { events: ApiEvent[] } };
        setEvents(json._embedded?.events || []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [location, category, genre]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with dropdown city selector */}
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold mr-2">Trending Events in</h2>
          <div className="relative">
            <NavButton
              onClick={() => setDropdownOpen(o => !o)}
              ariaHasPopup
              className="flex items-center space-x-1"
            >
              <span className="text-blue-500">{location}</span>
              <svg
                className="w-4 h-4 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 
                  01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </NavButton>

            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg overflow-auto max-h-64 z-50">
                {cities.map((c) => (
                  <li key={c.label}>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        onSelectLocation(c.label);
                        setDropdownOpen(false);
                      }}
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Event feed */}
        {loading ? (
          <p>Loading trending events…</p>
        ) : events.length === 0 ? (
          <p>No trending events found.</p>
        ) : (
          <div className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 px-2">
            {events.map((event) => (
              <EventCard
                key={event.id}
                title={event.name}
                image={event.images?.[0]?.url}
                date={event.dates?.start?.localDate}
                venue={event._embedded?.venues?.[0]?.name}
                href={`/events/${event.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
