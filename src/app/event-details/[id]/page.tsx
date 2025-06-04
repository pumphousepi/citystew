// src/app/event-details/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { EventDetail } from '../../../types/EventDetail';

export default function EventDetailPage() {
  // useParams() is a generic string‐record, so we cast to { id: string }:
  const { id } = useParams() as { id: string };
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchEvent() {
      setLoading(true);
      try {
        const res = await fetch(`/api/event-details/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as EventDetail;
        setEvent(data);
      } catch (err) {
        console.error('Failed to fetch event details:', err);
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
        <p className="text-lg">Loading event details…</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Event not found.</p>
      </div>
    );
  }

  // Pick a “16_9”‐ratio image if available, else first image, else placeholder
  const heroImageUrl =
    event.images?.find((img) => img.ratio === '16_9' && img.width && img.width >= 640)
      ?.url ??
    event.images?.[0]?.url ??
    '/assets/images/placeholder.jpg';

  // Format date/time
  const localDate = event.dates?.start?.localDate;
  const localTime = event.dates?.start?.localTime;
  const displayDateTime = localDate
    ? `${localDate}${localTime ? ` at ${localTime}` : ''}`
    : 'Date TBD';

  // Venue (use the first one, if any)
  const venue = event._embedded?.venues?.[0];
  const venueName = venue?.name ?? 'Venue TBD';
  const venueCity = venue?.city?.name;
  const venueState = venue?.state?.stateCode;
  const venueAddressLine = venue?.address?.line1;
  const venuePostal = venue?.address?.postalCode;

  // Description / “info” fallback
  const description = event.info || event.pleaseNote || 'No description available.';

  // Price‐range display
  const priceText = event.priceRanges
    ? event.priceRanges
        .map((pr) => {
          const min = pr.min != null ? `$${pr.min}` : '';
          const max = pr.max != null ? `$${pr.max}` : '';
          return min && max ? `${min}–${max}` : min || max || '';
        })
        .join(', ')
    : '';

  // Classification display (e.g. “Music › Rock”)
  const classificationText = event.classifications
    ?.map((c) => [c.segment?.name, c.genre?.name].filter(Boolean).join(' › '))
    .join(', ');

  // Seatmap (if supplied)
  const seatMapUrl = event.seatmap?.staticUrl;

  return (
    <div className="flex flex-col">
      {/* ─── Hero Banner ─── */}
      <div className="relative h-64 w-full">
        <img
          src={heroImageUrl}
          alt={event.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/assets/images/placeholder.jpg';
          }}
        />
        {/* gradient overlay to darken bottom for text contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"
          aria-hidden="true"
        />
      </div>

      {/* ─── Overlapping Card with Title/Info/Buy Button ─── */}
      <div className="relative -mt-16 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
          <p className="text-gray-700 mb-1">{displayDateTime}</p>
          <p className="text-gray-700 mb-1">
            {venueName}
            {venueCity && venueState && ` • ${venueCity}, ${venueState}`}
          </p>
          {venueAddressLine && (
            <p className="text-gray-700 mb-1">{venueAddressLine}</p>
          )}
          {venuePostal && (
            <p className="text-gray-700 mb-2">Postal Code: {venuePostal}</p>
          )}
          {classificationText && (
            <p className="text-sm text-gray-500 mb-2">{classificationText}</p>
          )}
          {priceText && (
            <p className="text-sm text-gray-500 mb-2">Price: {priceText}</p>
          )}
          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
            >
              Buy Tickets
            </a>
          )}
        </div>
      </div>

      {/* ─── Main Content: Two Columns ─── */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Left Column (2/3 width) ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Section */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>

          {/* Seating Chart / Additional Info */}
          {seatMapUrl && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-2">Seating Chart</h3>
              <a
                href={seatMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Seating Chart
              </a>
            </div>
          )}
        </div>

        {/* ─── Right Column (1/3 width) ─── */}
        <aside className="space-y-6">
          {/* You Might Also Like (Placeholder) */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">You Might Also Like</h3>
            <p className="text-gray-500">Coming soon…</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
