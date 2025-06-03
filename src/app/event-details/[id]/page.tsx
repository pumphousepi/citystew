// src/app/event-details/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface EventDetails {
  name: string;
  url?: string;
  dates?: {
    start?: {
      localDate?: string;
      localTime?: string;
    };
  };
  _embedded?: {
    venues?: {
      name?: string;
      city?: { name?: string };
    }[];
  };
  images?: { url: string }[];
}

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/event-details/${id}`);
        if (!res.ok) throw new Error('Failed to fetch event');
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error('Failed to load event:', err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-medium">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20 text-red-600 text-lg">
        Event not found.
      </div>
    );
  }

  const image = event.images?.[0]?.url || '/placeholder.jpg';
  const venue = event._embedded?.venues?.[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <img
        src={image}
        alt={event.name}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{event.name}</h1>

      {event.dates?.start?.localDate && (
        <p className="text-gray-700 mb-2">
          📅 {event.dates.start.localDate}
          {event.dates.start.localTime && ` at ${event.dates.start.localTime}`}
        </p>
      )}

      {venue && (
        <p className="text-gray-700 mb-4">
          📍 {venue.name}, {venue.city?.name}
        </p>
      )}

      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Buy Tickets
        </a>
      )}
    </div>
  );
}
