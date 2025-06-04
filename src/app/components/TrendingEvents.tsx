// src/app/components/TrendingEvents.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [events, setEvents]           = useState<ApiEvent[]>([]);
  const [loading, setLoading]         = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const [cities, setCities]           = useState<CityOption[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Default category is music if not provided via props
  const activeCategory = category || 'music';

  // Load city list
  useEffect(() => {
    fetch('/api/locations/cities')
      .then(res => res.json())
      .then((data: CityOption[]) => setCities(data))
      .catch(err => console.error('[TrendingEvents] cities load error', err));
  }, []);

  // Fetch trending events when location, category, or genre changes
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
      console.log('[TrendingEvents] Fetching →', url);

      try {
        const res  = await fetch(url);
        const json = await res.json();
        console.log('[TrendingEvents] Response →', json);

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

  const scrollBy = (distance: number) => {
    scrollerRef.current?.scrollBy({ left: distance, behavior: 'smooth' });
  };

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const onSelectCity = (loc: string) => {
    onSelectLocation(loc);
    setDropdownOpen(false);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header with city selector */}
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
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"/>
              </svg>
            </NavButton>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg overflow-auto max-h-64">
                {cities.map(c => (
                  <li key={c.label}>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
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

        {/* Scroll arrows */}
        <button
          onClick={() => scrollBy(-300)}
          className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          onClick={() => scrollBy(300)}
          className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>

        {/* Event cards */}
        {loading ? (
          <p>Loading trending {activeCategory}…</p>
        ) : rateLimited ? (
          <p className="text-red-600">Rate limit exceeded, please wait a moment.</p>
        ) : events.length === 0 ? (
          <p>No {activeCategory} found.</p>
        ) : (
          <div
            ref={scrollerRef}
            className="flex space-x-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
          >
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
