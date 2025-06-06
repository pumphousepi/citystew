// src/app/components/TheaterList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
        setTheaters(json.results || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [location]);

  // Show up to four theaters; “View All” links to /theaters?city=…&stateCode=…
  const visibleTheaters = theaters.slice(0, 4);
  const [cityName, stateCode] = location.split(',').map((s) => s.trim());

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <h2 className="text-2xl font-bold mb-6">
          Movie Theaters in <span className="text-blue-500">{location}</span>
        </h2>

        {loading ? (
          <p>Loading theaters…</p>
        ) : theaters.length === 0 ? (
          <p>No theaters found.</p>
        ) : (
          <>
            {/* Grid of cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleTheaters.map((t) => {
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  t.name + ' ' + t.vicinity
                )}`;

                return (
                  <a
                    key={t.place_id}
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition flex flex-col h-full"
                  >
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold line-clamp-2">{t.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{t.vicinity}</p>
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

            {/* “View All Theaters” Link */}
            <div className="mt-6 flex justify-end">
              <Link
                href={`/theaters?city=${encodeURIComponent(cityName)}&stateCode=${encodeURIComponent(
                  stateCode
                )}`}
                className="text-sm text-blue-600 hover:underline"
              >
                View All Theaters
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
