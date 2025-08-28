// src/app/events/page.tsx
import { Suspense } from 'react';
import EventList from '../components/EventList';
import SponsoredCard from '../components/SponsoredCard';
import EventHeader from '../components/EventHeader';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // ✅ Next 15: searchParams is a Promise; read it on the server
  const sp = await searchParams;
  const city = typeof sp.city === 'string' ? sp.city : '';
  const state = typeof sp.state === 'string' ? sp.state : '';
  const category = typeof sp.category === 'string' ? sp.category : '';

  const heading =
    city && state ? `Events in ${city}, ${state}` : 'All Upcoming Events';

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Header with optional location display */}
      <EventHeader eventName={heading} venueName="" venueLocation="" />

      <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Events */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">{heading}</h1>

          {/* Wrap in Suspense to satisfy CSR bailout rules if any child does client-side fetching */}
          <Suspense fallback={<div className="text-gray-600">Loading events…</div>}>
            <EventList city={city} state={state} category={category} />
          </Suspense>
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
