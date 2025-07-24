'use client';

import { Suspense } from 'react';
import SearchResults from './SearchResults';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-6 text-lg text-gray-600">Loading search results...</div>}>
      <SearchResults />
    </Suspense>
  );
}
