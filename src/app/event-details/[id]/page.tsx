// src/app/event-details/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

interface ApiEvent {
  name: string;
  url?: string;
  dates?: {
    start?: { localDate?: string; localTime?: string };
  };
  _embedded?: {
    venues?: { name: string; city: { name: string } }[];
  };
}

async function fetchEventDetailsFromAPI(id: string): Promise<ApiEvent | null> {
  try {
    const res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${process.env.TICKETMASTER_API_KEY}`
    );
    if (!res.ok) return null;
    const data: ApiEvent = await res.json();
    return data;
  } catch {
    return null;
  }
}

// This is now a Server Component (no 'use client'), so asynchronous fetch is allowed
export default async function EventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await fetchEventDetailsFromAPI(params.id);
  if (!event) {
    notFound(); // renders Next.js 404 if API returns null
  }

  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
      <p className="mb-1">
        {event.dates?.start?.localDate} @ {event.dates?.start?.localTime}
      </p>
      <p className="mb-4">
        {event._embedded?.venues?.[0]?.name},{' '}
        {event._embedded?.venues?.[0]?.city?.name}
      </p>

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
