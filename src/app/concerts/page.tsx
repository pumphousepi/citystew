// src/app/concerts/page.tsx
'use client';

import React from 'react';
import EventHeader from '../components/EventHeader';
import Footer from '../components/Footer';

export default function ConcertsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <EventHeader
        eventName="Concerts Near You"
        eventDateTime=""
        venueName=""
        venueLocation=""
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Find Concert Tickets</h1>
        <p className="text-gray-600">
          Browse upcoming concerts, music festivals, and live shows in your city.
        </p>

        <div className="mt-8 bg-gray-100 p-4 rounded">
          <p className="text-sm text-gray-500">🎵 This page will soon include genre filters, top artists, and featured concerts.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
