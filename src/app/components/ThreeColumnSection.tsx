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

interface Props {
  location: string; // "City, ST"
}

export default function ThreeColumnSection({ location }: Props) {
  const [upcomingEvents, setUpcomingEvents] = useState<ApiEvent[]>([]);
  const [topSellers, setTopSellers] = useState<ApiEvent[]>([]);
  const [familyEvents, setFamilyEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [city, state] = location.split(',').map((part) => part.trim());

  useEffect(() => {
    if (!city || !state) return;

    async function fetchEvents() {
      setLoading(true);

      try {
        const upcomingRes = await fetch(
          `/api/events?date=upcoming&city=${city}&stateCode=${state}`
        );
        const upcomingData = await upcomingRes.json();

        const topSellersRes = await fetch(
          `/api/events?sort=relevance&city=${city}&stateCode=${state}`
        );
        const topSellersData = await topSellersRes.json();

        const familyRes = await fetch(
          `/api/events?category=family&city=${city}&stateCode=${state}`
        );
        const familyData = await familyRes.json();

        setUpcomingEvents(upcomingData._embedded?.events || []);
        setTopSellers(topSellersData._embedded?.events || []);
        setFamilyEvents(familyData._embedded?.events || []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [city, state]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="flex flex-col rounded-2xl shadow-lg bg-white p-4 max-h-[600px]">
          <h3 className="text-xl font-bold text-blue-600 mb-3 flex-shrink-0">
            Upcoming Events
          </h3>
          <div className="overflow-y-auto flex-grow space-y-4">
            {loading ? (
              <p>Loading...</p>
            ) : upcomingEvents.length === 0 ? (
              <p>No upcoming events found.</p>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="border-b pb-3 last:border-none"
                >
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
                    {event._embedded?.venues?.[0]?.city?.name ||
                      'City TBD'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Sellers */}
        <div className="flex flex-col rounded-2xl shadow-lg bg-gray-100 p-4 max-h-[600px]">
          <h3 className="text-xl font-bold text-red-600 mb-3 flex-shrink-0">
            Top Sellers
          </h3>
          <div className="overflow-y-auto flex-grow space-y-6">
            {loading ? (
              <p>Loading...</p>
            ) : topSellers.length === 0 ? (
              <p>No top sellers found.</p>
            ) : (
              topSellers.map((event) => {
                const performerName =
                  event._embedded?.attractions?.[0]?.name ||
                  'Featured Performer';
                return (
                  <div
                    key={event.id}
                    className="flex flex-col border-b pb-4 last:border-none"
                  >
                    <img
                      src={
                        event.images?.[0]?.url || '/placeholder.jpg'
                      }
                      alt={event.name}
                      className="rounded-lg mb-2 object-cover w-full h-40"
                    />
                    <p className="font-semibold text-gray-900">
                      {performerName}
                    </p>
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
        <div className="flex flex-col rounded-2xl shadow-lg bg-yellow-50 p-4 max-h-[600px]">
          <h3 className="text-xl font-bold text-green-600 mb-3 flex-shrink-0">
            Family Events
          </h3>
          <div className="overflow-y-auto flex-grow space-y-6">
            {loading ? (
              <p>Loading...</p>
            ) : familyEvents.length === 0 ? (
              <p>No family events found.</p>
            ) : (
              familyEvents.map((event) => (
                <div
                  key={event.id}
                  className="border-b pb-4 last:border-none"
                >
                  <a
                    href={`/events/${event.id}`}
                    className="font-semibold text-gray-900 hover:underline block mb-2"
                  >
                    {event.name}
                  </a>
                  <img
                    src={
                      event.images?.[0]?.url || '/placeholder.jpg'
                    }
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
