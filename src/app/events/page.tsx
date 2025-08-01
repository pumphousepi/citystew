'use client';

import { useSearchParams } from 'next/navigation';
import EventList from '../components/EventList';
import SponsoredCard from '../components/SponsoredCard';
import EventHeader from '../components/EventHeader';

export default function EventsPage() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city') || '';
  const state = searchParams.get('state') || '';
  const category = searchParams.get('category') || '';

  return (
    <div className="bg-white text-black min-h-screen">
      {/* ✅ Reusable Header with Logo and optional location display */}
      <EventHeader
        eventName={city && state ? `Events in ${city}, ${state}` : 'All Upcoming Events'}
        venueName=""
        venueLocation=""
      />

      <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Events */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">
            {city && state ? `Events in ${city}, ${state}` : 'All Upcoming Events'}
          </h1>
          <EventList city={city} state={state} category={category} />
        </div>

        {/* Right: Ad Sidebar */}
        <aside className="space-y-6">
          <SponsoredCard />
          <SponsoredCard />
          <div className="bg-yellow-50 border border-yellow-300 p-4 rounded text-sm text-yellow-800 shadow">
            🎯 Promote your business here!
            <br />
            <a href="/advertise" className="text-blue-600 underline font-medium">
              Advertise with CityStew
            </a>
          </div>
        </aside>
      </main>
    </div>
  );
}
