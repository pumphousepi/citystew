// src/app/components/ThreeColumnSection.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface ApiEvent {
  id: string;
  name: string;
  dates?: { start?: { localDate?: string } };
  _embedded?: {
    venues?: { name?: string; city?: { name?: string } }[];
    attractions?: { name: string }[];
  };
  images?: { url: string }[];
}

interface ThreeColumnSectionProps {
  location: string;      // "City, ST"
  category?: string;
  genre?: string;
}

export default function ThreeColumnSection({
  location,
  category,
  genre,
}: ThreeColumnSectionProps) {
  const [upcomingEvents, setUpcomingEvents] = useState<ApiEvent[]>([]);
  const [topSellers, setTopSellers] = useState<ApiEvent[]>([]);
  const [familyEvents, setFamilyEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [city, state] = location.split(',').map((p) => p.trim());

  useEffect(() => {
    if (!city || !state) {
      setLoading(false);
      return;
    }

    async function fetchEvents() {
      setLoading(true);
      const baseParams = new URLSearchParams();
      baseParams.append('city', city);
      baseParams.append('stateCode', state);

      if (category) baseParams.append('category', category);
      if (genre)    baseParams.append('genre', genre);

      try {
        // Upcoming
        const upcomingParams = new URLSearchParams(baseParams);
        upcomingParams.append('date', 'upcoming');
        const upcomingRes = await fetch(`/api/events?${upcomingParams}`);
        const upcomingData = await upcomingRes.json();

        // Top Sellers
        const topParams = new URLSearchParams(baseParams);
        topParams.append('sort', 'relevance');
        const topRes = await fetch(`/api/events?${topParams}`);
        const topData = await topRes.json();

        // Family
        const familyParams = new URLSearchParams(baseParams);
        familyParams.append('category', 'family');
        const familyRes = await fetch(`/api/events?${familyParams}`);
        const familyData = await familyRes.json();

        setUpcomingEvents(upcomingData._embedded?.events || []);
        setTopSellers(topData._embedded?.events || []);
        setFamilyEvents(familyData._embedded?.events || []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setUpcomingEvents([]);
        setTopSellers([]);
        setFamilyEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [city, state, category, genre]);

  // unified column container style
  const columnClass = "flex flex-col rounded-2xl shadow-lg bg-gray-100 p-4 max-h-[600px]";

  // unified header style matching TrendingEvents
  const headerClass = "text-2xl font-bold text-gray-800 mb-4";

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className={columnClass}>
          <h2 className={headerClass}>Upcoming Events</h2>
          <div className="overflow-y-auto flex-grow space-y-4">
            {loading ? (
              <p>Loading...</p>
            ) : upcomingEvents.length === 0 ? (
              <p>No upcoming events found.</p>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="border-b pb-3 last:border-none">
                  <a
                    href={`/events/${event.id}`}
                    className="font-semibold text-gray-900 hover:underline"
                  >
                    {event.name}
                  </a>
                  <p className="text-sm text-gray-600">
                    {event.dates?.start?.localDate || 'Date TBD'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {event._embedded?.venues?.[0]?.name || 'Venue TBD'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {event._embedded?.venues?.[0]?.city?.name || 'City TBD'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Sellers */}
        <div className={columnClass}>
          <h2 className={headerClass}>Top Sellers</h2>
          <div className="overflow-y-auto flex-grow space-y-6">
            {loading ? (
              <p>Loading...</p>
            ) : topSellers.length === 0 ? (
              <p>No top sellers found.</p>
            ) : (
              topSellers.map((event) => {
                const performer =
                  event._embedded?.attractions?.[0]?.name || 'Featured Performer';
                return (
                  <div key={event.id} className="flex flex-col border-b pb-4 last:border-none">
                    <img
                      src={event.images?.[0]?.url || '/placeholder.jpg'}
                      alt={event.name}
                      className="rounded-lg mb-2 object-cover w-full h-40"
                    />
                    <p className="font-semibold text-gray-900">{performer}</p>
                    <a
                      href={`/events/${event.id}`}
                      className="mt-2 inline-block bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-center"
                    >
                      View Tickets
                    </a>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Family Events */}
        <div className={columnClass}>
          <h2 className={headerClass}>Family Events</h2>
          <div className="overflow-y-auto flex-grow space-y-6">
            {loading ? (
              <p>Loading...</p>
            ) : familyEvents.length === 0 ? (
              <p>No family events found.</p>
            ) : (
              familyEvents.map((event) => (
                <div key={event.id} className="border-b pb-4 last:border-none">
                  <a
                    href={`/events/${event.id}`}
                    className="font-semibold text-gray-900 hover:underline block mb-2"
                  >
                    {event.name}
                  </a>
                  <img
                    src={event.images?.[0]?.url || '/placeholder.jpg'}
                    alt={event.name}
                    className="rounded-lg object-cover w-full h-40 mb-2"
                  />
                  <a
                    href={`/events/${event.id}`}
                    className="inline-block bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    View Tickets
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
