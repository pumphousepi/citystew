'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import EventCard from './EventCard';
import NavButton from './NavButton';

interface ApiEvent {
  id: string;
  name: string;
  images?: { url?: string }[];
  dates?: { start?: { localDate?: string } };
  _embedded?: { venues?: { name?: string }[] };
}

interface CityOption {
  name: string;
  abbreviation: string;
  label: string;
}

interface TrendingEventsProps {
  location: string;
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
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeCategory = category || 'music';

  useEffect(() => {
    fetch('/api/locations/cities')
      .then(res => res.json())
      .then((data: CityOption[]) => setCities(data))
      .catch(err => console.error('[TrendingEvents] cities load error', err));
  }, []);

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
        category: activeCategory,
      });
      if (genre) params.append('genre', genre);

      const url = `/api/events?${params.toString()}`;

      try {
        const res = await fetch(url);
        const json = await res.json();

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
  }, [location, activeCategory, genre]);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const onSelectCity = (loc: string) => {
    onSelectLocation(loc);
    setDropdownOpen(false);
  };

  const baseQueryFromLocation = (): string => {
    const [cityName, stateCode] = location.split(',').map(s => s.trim());
    return cityName && stateCode
      ? `&city=${encodeURIComponent(cityName)}&state=${encodeURIComponent(stateCode)}`
      : '';
  };

  const visibleEvents = events.slice(0, 4);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold mr-2">
            Trending {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} in
          </h2>

          <div className="relative">
            <NavButton
              onClick={toggleDropdown}
              ariaHasPopup
              className="flex items-center space-x-1"
            >
              <span className="text-blue-500">{location}</span>
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 
                     0 111.06 1.06l-4.24 4.24a.75.75 0 
                     01-1.06 0L5.21 8.27a.75.75 0 
                     01.02-1.06z"
                />
              </svg>
            </NavButton>

            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg overflow-auto max-h-64">
                {cities.map(c => (
                  <li key={c.label}>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => onSelectCity(c.label)}
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {loading ? (
          <p>Loading trending {activeCategory}…</p>
        ) : rateLimited ? (
          <p className="text-red-600">Rate limit exceeded, please wait a moment.</p>
        ) : events.length === 0 ? (
          <p>No {activeCategory} found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleEvents.map(evt => (
                <EventCard
                  key={evt.id}
                  title={evt.name}
                  image={evt.images?.[0]?.url}
                  date={evt.dates?.start?.localDate}
                  venue={evt._embedded?.venues?.[0]?.name}
                  href={`/events/${evt.id}`} // ✅ Updated here
                />
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                href={`/events?category=${encodeURIComponent(activeCategory)}${baseQueryFromLocation()}`}
                className="text-sm text-blue-600 hover:underline"
              >
                View All Events
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
