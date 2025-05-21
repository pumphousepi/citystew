import React, { Suspense } from 'react';
import SearchResults from './SearchResults';

export default function SearchPage() {
  return (
    <section className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Search Events</h1>
      <Suspense fallback={<p>Loading search results...</p>}>
        <SearchResults />
      </Suspense>
    </section>
  );
}
