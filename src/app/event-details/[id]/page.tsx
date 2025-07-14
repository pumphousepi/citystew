'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EventHeader from '../../components/EventHeader';

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
      state?: { name?: string };
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

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading event details...</p>
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

  const image = event.images?.[0]?.url || '/assets/images/placeholder.jpg';
  const venue = event._embedded?.venues?.[0];

  return (
    <div>
      <EventHeader
        eventName={event.name}
        eventDateTime={`${event.dates?.start?.localDate} • ${event.dates?.start?.localTime || 'TBD'}`}
        venueName={venue?.name || ''}
        venueLocation={`${venue?.city?.name || ''}, ${venue?.state?.name || ''}`}
        imageUrl={image}
      />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Event Image */}
        <div className="rounded-xl overflow-hidden shadow-lg mb-10">
          <img src={image} alt={event.name} className="w-full h-80 object-cover" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ticket Options */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Available Tickets</h2>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">General Admission - SRO</p>
                    <p className="text-sm text-gray-500">Row GA{i + 1}</p>
                    <p className="text-sm text-gray-500">1 - 4 tickets</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${125 + i * 5}</p>
                    <p className="text-sm text-gray-500">ea.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Seating Chart */}
          <div className="border rounded-lg p-4 bg-gray-50 text-center">
            <h2 className="text-lg font-semibold mb-3">Seating Chart</h2>
            <img
              src="/assets/images/sample-seating-chart.png"
              alt="Seating Chart"
              className="w-full object-contain"
            />
            <p className="text-sm text-gray-500 mt-2">Not all sections may apply to this event</p>
          </div>
        </div>
      </div>
    </div>
  );
}
