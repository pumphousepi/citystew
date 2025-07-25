'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import EventHeader from '../components/EventHeader';
import Footer from '../components/Footer';

interface Event {
  id: string;
  name: string;
  dates?: {
    start?: {
      localDate?: string;
    };
  };
  images?: {
    url: string;
  }[];
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'Events';
  const city = searchParams.get('city');
  const state = searchParams.get('state');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (city) params.append('city', city);
        if (state) params.append('stateCode', state);

        const res = await fetch(`/api/events?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch events');

        const data = await res.json();
        const today = new Date();

        const uniqueImages = new Set<string>();
        const upcomingEvents = (data._embedded?.events || [])
          .filter((event: Event) => {
            const dateStr = event.dates?.start?.localDate;
            const eventDate = dateStr ? new Date(dateStr) : null;
            return eventDate && eventDate >= today;
          })
          .filter((event: Event) => {
            const imageUrl = event.images?.[0]?.url;
            if (imageUrl && !uniqueImages.has(imageUrl)) {
              uniqueImages.add(imageUrl);
              return true;
            }
            return false;
          });

        setEvents(upcomingEvents);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [category, city, state]);

  const headerText = `${category.charAt(0).toUpperCase() + category.slice(1)} Events${city && state ? ` in ${city}, ${state}` : ''}`;

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <EventHeader eventName={headerText} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <p className="text-lg">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-lg text-gray-600">No upcoming events found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {events.map(event => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition duration-300 border border-gray-200"
              >
                {event.images?.[0]?.url && (
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={event.images[0].url}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-base mb-1 line-clamp-2">{event.name}</h3>
                  <p className="text-sm text-gray-500">
                    {event.dates?.start?.localDate || 'Date TBD'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
