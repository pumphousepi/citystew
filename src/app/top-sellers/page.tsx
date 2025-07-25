import EventHeader from '../components/EventHeader';
import Footer from '../components/Footer';

export default function TopSellersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <EventHeader
        eventName="Top Sellers"
        eventDateTime=""
        venueName=""
        venueLocation=""
      />

      <main className="flex-grow bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Selling Events</h2>
          <p className="text-gray-700">
            This is the landing page for the top-selling events on CityStew.
            You can list events here dynamically based on popularity.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
