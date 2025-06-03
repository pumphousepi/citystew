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
  // next/navigation’s useParams returns a generic string record,
  // so we cast to { id: string } so TS knows “id” is a string.
  const { id } = useParams() as { id: string };
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/event-details/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = (await res.json()) as EventDetails;
        setEvent(data);
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
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

  // Safely grab the first image URL or fall back to a placeholder
  const image = event.images?.[0]?.url ?? '/placeholder.jpg';
  // “venue” might be undefined, so TS needs to know we guard before using it
  const venue = event._embedded?.venues?.[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <img
        src={image}
        alt={event.name}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />

      <h1 className="text-3xl font-bold mb-2">{event.name}</h1>

      {/* Only render date/time if both exist */}
      {event.dates?.start?.localDate && (
        <p className="text-gray-700 mb-2">
          📅 {event.dates.start.localDate}
          {event.dates.start.localTime && ` at ${event.dates.start.localTime}`}
        </p>
      )}

      {/* Only render venue if it’s defined */}
      {venue && (
        <p className="text-gray-700 mb-4">
          📍 {venue.name ?? ''}, {venue.city?.name ?? ''}
        </p>
      )}

      {/* Only render Buy Tickets link if `event.url` is truthy */}
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
