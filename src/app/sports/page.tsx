import EventHeader from '../components/EventHeader';
import Footer from '../components/Footer';

export default function SportsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <EventHeader
        eventName="Sports Events"
        eventDateTime=""
        venueName=""
        venueLocation=""
      />

      <main className="flex-grow bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Sports Events</h2>
          <p className="text-gray-700">
            Browse the hottest sports events including football, basketball, baseball, and more.
            This landing page will eventually feature dynamic listings filtered by sports category.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
