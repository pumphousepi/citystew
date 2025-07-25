import { Suspense } from 'react';
import EventsPage from './EventsPageClient';

export default function PageWrapper() {
  return (
    <Suspense fallback={<p className="p-4">Loading events...</p>}>
      <EventsPage />
    </Suspense>
  );
}
