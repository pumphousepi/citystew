'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic'; // ensure server-side rendering on each request (optional)
export const revalidate = 60;          // revalidate/cache for 60 seconds (optional)

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventPageProps) {
  // Next.js 15 passes params as a Promise, so we await it
  const { id } = await params;

  // Fetch event data from Ticketmaster Discovery API (server-side)
  const apiKey = process.env.TICKETMASTER_API_KEY;
  const res = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${apiKey}`
  );

  if (!res.ok) {
    // If the event is not found or an error occurs, render Next.js 404
    notFound();
  }

  const event = await res.json();

  return (
    <div>
      <h1>{event.name}</h1>
      <p>{event.dates?.start?.localDate} at {event._embedded?.venues?.[0]?.name}</p>
      {/* Render more event details as needed */}
    </div>
  );
}
