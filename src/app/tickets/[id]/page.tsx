'use client';

import React, { useState, useEffect } from 'react';
import EventCard from '../../components/EventCard';

interface ApiEvent {
  id: string;
  name: string;
  url?: string;
  dates?: { start?: { localDate?: string; localTime?: string } };
  _embedded?: { venues?: { name?: string; city?: { name?: string } }[] };
  images?: { url: string }[];
}

export default function TicketPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        const res = await fetch(`/api/event-details/${id}`);
        if (!res.ok) throw new Error('Failed to load event');
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }
    fetchEventDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-center">
        <h1 className="text-2xl font-bold mb-2">Checking Availability...</h1>
        <p>Hang tight — we’re pulling event details.</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <p>Sorry, we couldn’t find this event.</p>
      </div>
    );
  }

  const imageUrl = event.images?.[0]?.url || '/assets/images/placeholder.jpg';
  const venue = event._embedded?.venues?.[0];

  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <img
        src={imageUrl}
        alt={event.name}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
      {event.dates?.start?.localDate && (
        <p className="mb-1">
          {event.dates.start.localDate}
          {event.dates.start.localTime && ` @ ${event.dates.start.localTime}`}
        </p>
      )}
      {venue && (
        <p className="mb-4">
          {venue.name}, {venue.city?.name}
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
