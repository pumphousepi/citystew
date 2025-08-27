'use client';

import { useEffect, useState } from 'react';
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
      state?: { name?: string };
      address?: { line1?: string };
    }[];
  };
  images?: { url: string }[];
}

function BannerAd() {
  return (
    <div className="w-full bg-blue-100 border border-blue-300 p-4 text-center my-6 rounded shadow">
      <p className="text-sm text-gray-800 font-medium">
        Sponsored by <span className="text-blue-700 font-semibold">Taco & Tequila Bar</span> — 2 blocks from this venue!
      </p>
    </div>
  );
}

function SponsoredCard() {
  return (
    <div className="bg-white border border-yellow-300 p-4 rounded-lg shadow-md relative my-6">
      <span className="absolute top-2 right-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Sponsored</span>
      <h3 className="text-lg font-semibold">Happy Hour at Joe's Bar</h3>
      <p className="text-sm text-gray-700">
        Just across the street — get 2-for-1 drinks before the show!
      </p>
      <a
        href="https://your-link.com"
        target="_blank"
        className="inline-block mt-2 text-sm text-blue-600 underline"
      >
        View Offer
      </a>
    </div>
  );
}

function VideoAd() {
  return (
    <div className="mt-10">
      <p className="text-sm text-gray-600 mb-2">Promotional Video</p>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          className="w-full h-full rounded"
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
          title="Promotional Video"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/event-details/${id}`);
        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const data = await res.json();
        setEvent(data);
      } catch (err: any) {
        console.error('Fetch event failed:', err);
        setError('Unable to load event. Please try again later.');
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-semibold mb-4">Checking Availability...</h2>
        <div className="w-72 h-3 rounded bg-gray-200 overflow-hidden mb-4">
          <div className="h-full w-2/5 bg-teal-500 animate-pulse"></div>
        </div>
        <div className="bg-red-100 text-red-800 px-4 py-3 rounded">
          <strong>⚠️ Limited Inventory!</strong> This event is popular. Buy your tickets before it sells out.
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-20 text-red-600 text-lg">
        {error || 'Event not found.'}
      </div>
    );
  }

  const image = event.images?.[0]?.url || '/assets/images/placeholder.jpg';
  const venue = event._embedded?.venues?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* ─── Hero Banner ─── */}
      <div className="rounded-xl overflow-hidden shadow-lg mb-8">
        <img
          src={image}
          alt={event.name}
          className="w-full h-80 object-cover"
        />
        <div className="bg-white p-6">
          <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
          <p className="text-gray-700">
            📅 {event.dates?.start?.localDate}
            {event.dates?.start?.localTime && ` at ${event.dates.start.localTime}`}
          </p>
          {venue && (
            <p className="text-gray-700 mt-1">
              📍 {venue.name} • {venue.city?.name}, {venue.state?.name}
              <br />
              {venue.address?.line1}
            </p>
          )}
        </div>
      </div>

      <BannerAd />

      {/* ─── Tickets + Seating Chart ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Tickets */}
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
                  <p className="text-lg font-bold text-green-600">$125</p>
                  <p className="text-sm text-gray-500">ea.</p>
                </div>
              </div>
            </div>
          ))}

          <SponsoredCard />
        </div>

        {/* Right: Seating Chart */}
        <div className="border rounded-lg p-4 bg-gray-50 text-center">
          <h2 className="text-lg font-semibold mb-3">Seating Chart</h2>
          <img
            src="/assets/images/sample-seating-chart.png"
            alt="Seating Chart"
            className="w-full object-contain"
          />
          <p className="text-sm text-gray-500 mt-2">
            Not all sections may apply to this event
          </p>

          <VideoAd />
        </div>
      </div>
    </div>
  );
}
