'use client';

import React, { useEffect, useState, useRef } from 'react';
import NavButton from './NavButton'; // used to toggle “location” display

interface Theater {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  geometry: { location: { lat: number; lng: number } };
}

interface Props {
  location: string; // e.g. "Austin, TX"
}

export default function TheaterList({ location }: Props) {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // still used for toggling UI
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const [city, stateCode] = location.split(',').map((s) => s.trim());
    setLoading(true);

    fetch(
      `/api/theaters?city=${encodeURIComponent(city)}&stateCode=${encodeURIComponent(
        stateCode
      )}`
    )
      .then((res) => res.json())
      .then((json) => {
        // assume API returns an object with `.results` array
        setTheaters(json.results || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [location]);

  const scrollBy = (dx: number) => {
    scroller.current?.scrollBy({ left: dx, behavior: 'smooth' });
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header: no wrap */}
        <div className="flex items-center space-x-2 whitespace-nowrap mb-6">
          <h2 className="text-2xl font-bold flex-shrink-0">Movie Theaters in</h2>
          <NavButton onClick={() => setOpen((o) => !o)} className="flex-shrink-0">
            <span>{location}</span>
          </NavButton>
        </div>

        {/* Cards */}
        {loading ? (
          <p>Loading theaters…</p>
        ) : theaters.length === 0 ? (
          <p>No theaters found.</p>
        ) : (
          <div className="relative">
            {/* Left arrow */}
            <button
              onClick={() => scrollBy(-300)}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow"
              aria-label="Scroll left"
            >
              ‹
            </button>

            {/* Scrollable row of cards */}
            <div ref={scroller} className="flex space-x-4 overflow-x-auto scroll-smooth pb-2">
              {theaters.map((t) => {
                // Build Google Maps link
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  t.name + ' ' + t.vicinity
                )}`;
                return (
                  <a
                    key={t.place_id}
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-[240px] bg-white rounded-2xl shadow-lg overflow-hidden flex-shrink-0"
                  >
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{t.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{t.vicinity}</p>
                      {t.rating != null && (
                        <p className="text-sm text-gray-700 mt-2">
                          ★ {t.rating} ({t.user_ratings_total})
                        </p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => scrollBy(300)}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow"
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
