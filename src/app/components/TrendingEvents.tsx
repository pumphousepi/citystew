// src/app/components/TrendingEvents.tsx
'use client';

import { useEffect, useState } from 'react';
import { ChevronDown as ChevronDownIcon } from 'lucide-react'; // ← import your icon
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
  label: string;
}

interface TrendingEventsProps {
  location: string;                   // lowercase!
  category?: string;
  genre?: string;
  onSelectLocation: (loc: string) => void;
}

export default function TrendingEvents({
  location,                         // ← lowercase
  category,
  genre,
  onSelectLocation,
}: TrendingEventsProps) {
  const [events, setEvents]             = useState<ApiEvent[]>([]);
  const [loading, setLoading]           = useState(true);
  const [rateLimited, setRateLimited]   = useState(false);
  const [cities, setCities]             = useState<CityOption[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Load cities for dropdown
  useEffect(() => {
    fetch('/api/locations/cities')
      .then(r => r.json())
      .then((data: CityOption[]) => setCities(data))
      .catch(err => console.error('[TrendingEvents] cities load error:', err));
  }, []);

  // Fetch trending events
  useEffect(() => {
    if (!location.includes(',')) {
      setEvents([]);
      setLoading(false);
      return;
    }
    const [city, stateCode] = location.split(',').map(s => s.trim());

    (async () => {
      setLoading(true);
      setRateLimited(false);

      const params = new URLSearchParams({
        city,
        stateCode,
        trending: 'true',
        size: '10',
      });
      if (category) params.append('category', category);
      if (genre)    params.append('genre', genre);

      const url = `/api/events?${params.toString()}`;
      console.log('[TrendingEvents] Fetching →', url);

      try {
        const res  = await fetch(url);
        console.log('[TrendingEvents] Status →', res.status);

        const json = await res.json();
        console.log('[TrendingEvents] JSON →', json);

        if (res.status === 429) {
          setRateLimited(true);
          setEvents([]);
        } else if (!res.ok) {
          console.error('[TrendingEvents] API error →', json);
          setEvents([]);
        } else {
          setEvents(json._embedded?.events ?? []);
        }
      } catch (err) {
        console.error('[TrendingEvents] Fetch error →', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [location, category, genre]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header & dropdown */}
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold mr-2">Trending Events in</h2>
          <div className="relative">
            <NavButton
              onClick={() => setDropdownOpen(o => !o)}
              ariaHasPopup
              className="flex items-center space-x-1"
            >
              <span className="text-blue-500">{location}</span>
              <ChevronDownIcon className="w-4 h-4 text-blue-500" />
            </NavButton>

            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50 overflow-auto max-h-64">
                {cities.map(c => (
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

        {/* Body */}
        {loading ? (
          <p>Loading trending events…</p>
        ) : rateLimited ? (
          <p className="text-red-600">
            Ticketmaster rate limit exceeded. Please wait a moment.
          </p>
        ) : events.length === 0 ? (
          <p>No trending events found.</p>
        ) : (
          <div className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 px-2">
            {events.map(evt => (
              <EventCard
                key={evt.id}
                title={evt.name}
                image={evt.images?.[0]?.url}
                date={evt.dates?.start?.localDate}
                venue={evt._embedded?.venues?.[0]?.name}
                href={`/events/${evt.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
