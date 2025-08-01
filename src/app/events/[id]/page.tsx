'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EventHeader from '../../components/EventHeader';

interface EventDetail {
  name: string;
  dates?: { start?: { localDate?: string; localTime?: string } };
  images?: { url: string; ratio?: string; width?: number }[];
  seatmap?: { staticUrl?: string };
  _embedded?: {
    venues?: {
      name?: string;
      city?: { name?: string };
      state?: { stateCode?: string };
      address?: { line1?: string };
    }[];
  };
}

export default function EventDetailPage() {
  const { id } = useParams() as { id: string };
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchEvent() {
      try {
        const res = await fetch(`/api/event-details/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError('Event not found.');
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading event details…</div>;
  }

  if (error || !event) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">{error}</div>;
  }

  const image = event.images?.[0]?.url ?? '/assets/images/placeholder.jpg';
  const localDate = event.dates?.start?.localDate ?? '';
  const localTime = event.dates?.start?.localTime ?? '';
  const dateTimeDisplay = `${localDate}${localTime ? ` at ${localTime}` : ''}`;
  const venue = event._embedded?.venues?.[0];
  const venueName = venue?.name ?? '';
  const venueLocation = venue?.city?.name && venue?.state?.stateCode ? `${venue.city.name}, ${venue.state.stateCode}` : '';
  const seatMapUrl = event.seatmap?.staticUrl || '/assets/images/sample-seating-chart.png';

  return (
    <div className="bg-white text-black min-h-screen">
      <EventHeader eventName={event.name} eventDateTime={dateTimeDisplay} venueName={venueName} venueLocation={venueLocation} />

      <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <img src={image} alt={event.name} className="rounded-xl shadow object-cover w-full h-64" />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Available Tickets</h2>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border rounded p-4 shadow-sm">
                <p className="font-semibold">General Admission - Row GA{i + 1}</p>
                <p className="text-sm text-gray-600">1–4 Tickets</p>
                <p className="text-lg font-bold text-green-600">${125 + i * 5} <span className="text-sm text-gray-500">ea.</span></p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-gray-100 border rounded px-4 py-2 text-sm">
            <span>📞 Ticketmaster Support: 1-800-653-8000</span>
            <div className="flex gap-4">
              <button className="text-blue-600 underline">Info</button>
              <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Buy Tickets</button>
            </div>
          </div>

          <div className="bg-gray-50 border rounded-xl p-6 text-center shadow">
            <h3 className="text-lg font-semibold mb-3">Seating Chart</h3>
            <img src={seatMapUrl} alt="Seating Chart" className="w-full object-contain rounded" />
            <p className="text-sm text-gray-500 mt-2">* Not all sections may apply to this event.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
